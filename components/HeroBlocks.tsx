"use client";

import { useEffect, useRef } from "react";

// 히어로 오른쪽의 3D 블록: 티엑스미 로고의 5×5 픽셀을 크롬 · 유광 큐브로 띄운 것.
//  - 마우스가 지나가면 가까운 큐브가 떠오르고, 묶음 전체가 살짝 기운다
//  - 클릭하면 흩어졌다가 다시 모인다
//  - 스크롤을 내리면 커지고, 큐브 하나가 화면을 채우며 다음 섹션의 배경색(#f5f5f5)이 된다
// 캔버스는 화면에 고정된 채 본문 뒤에 깔린다(히어로는 배경이 투명, 다음 섹션은 불투명).
// 넓은 화면에서만 켠다.

type Kind = "blue" | "deep" | "pearl" | "chrome" | "lime";

// [행][열] — 로고의 칸 배치 그대로. null은 빈칸
const GRID: (Kind | null)[][] = [
  ["pearl", "blue", null, "pearl", "blue"],
  ["blue", "chrome", "blue", "chrome", "blue"],
  [null, "blue", "lime", "chrome", null],
  ["blue", "pearl", null, "chrome", "blue"],
  ["deep", "blue", "chrome", "blue", "chrome"],
];
// 스크롤 끝에서 화면을 채울 큐브
const TARGET = { row: 2, col: 3 };
// 다음 섹션의 배경색 (globals.css 의 --paper-alt)
const NEXT_BG = "#f5f5f5";

// 종류별로 떠 있는 높이
const LIFT: Record<Kind, number> = {
  deep: 0,
  blue: 0.12,
  pearl: 0.38,
  chrome: 0.62,
  lime: 0.85,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 크롬에 비칠 주변 풍경: 하늘색 → 분홍 → 남색 띠와 밝은 조명 몇 개
function paintEnvironment() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, "#ffffff");
  sky.addColorStop(0.28, "#cfd6ff");
  sky.addColorStop(0.44, "#8f9bff");
  sky.addColorStop(0.5, "#ff9be0");
  sky.addColorStop(0.56, "#3a2bd6");
  sky.addColorStop(0.75, "#15124a");
  sky.addColorStop(1, "#5959ff");
  g.fillStyle = sky;
  g.fillRect(0, 0, 1024, 512);
  // 조명
  g.fillStyle = "#ffffff";
  for (const [x, y, w, h] of [
    [90, 60, 150, 150],
    [430, 30, 70, 210],
    [640, 90, 190, 90],
    [900, 50, 60, 180],
  ]) {
    g.fillRect(x, y, w, h);
  }
  // 라임 한 줄
  g.fillStyle = "#d7ff3e";
  g.fillRect(250, 270, 240, 22);
  g.fillRect(760, 300, 160, 16);
  return c;
}

export default function HeroBlocks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [THREE, { RoundedBoxGeometry }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
      ]);
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      // 마지막에 큐브 색을 다음 섹션 배경색과 정확히 맞춰야 해서 톤 보정을 끈다
      renderer.toneMapping = THREE.NoToneMapping;

      const scene = new THREE.Scene();
      const envSource = new THREE.CanvasTexture(paintEnvironment());
      envSource.mapping = THREE.EquirectangularReflectionMapping;
      envSource.colorSpace = THREE.SRGBColorSpace;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromEquirectangular(envSource);
      scene.environment = env.texture;
      envSource.dispose();
      pmrem.dispose();

      // 세계 단위 = 칸 1개. 화면상의 크기는 camera.zoom(px/칸)으로 정한다
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 400);
      camera.position.set(0, 0, 200);

      const sun = new THREE.DirectionalLight(0xffffff, 2.2);
      sun.position.set(-7, 14, 9);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -10;
      sun.shadow.camera.right = 10;
      sun.shadow.camera.top = 10;
      sun.shadow.camera.bottom = -10;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 60;
      sun.shadow.bias = -0.0006;
      sun.shadow.radius = 6;
      scene.add(sun);

      const group = new THREE.Group();
      scene.add(group);

      // 바닥: 그림자만 받는 투명한 면. 그림자는 로고의 파랑
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.ShadowMaterial({ color: 0x5959ff, opacity: 0.22 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      group.add(floor);

      const geometry = new RoundedBoxGeometry(1, 1, 1, 8, 0.24);

      const makeMaterial = (kind: Kind) => {
        switch (kind) {
          case "chrome":
            return new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              metalness: 1,
              roughness: 0.04,
            });
          case "pearl":
            return new THREE.MeshPhysicalMaterial({
              color: 0xd4d4ff,
              metalness: 0.85,
              roughness: 0.14,
              iridescence: 1,
              iridescenceIOR: 1.9,
              iridescenceThicknessRange: [180, 620],
            });
          case "lime":
            return new THREE.MeshPhysicalMaterial({
              color: 0xd7ff3e,
              metalness: 0.15,
              roughness: 0.2,
              clearcoat: 1,
              clearcoatRoughness: 0.04,
            });
          default:
            return new THREE.MeshPhysicalMaterial({
              color: kind === "deep" ? 0x3a3ae0 : 0x5050ff,
              metalness: 0.25,
              roughness: 0.2,
              clearcoat: 1,
              clearcoatRoughness: 0.04,
            });
        }
      };

      type Block = {
        mesh: import("three").Mesh;
        material: import("three").MeshPhysicalMaterial;
        col: number;
        row: number;
        lift: number;
        boost: number;
        off: import("three").Vector3;
        vel: import("three").Vector3;
        rot: import("three").Vector3;
        rotVel: import("three").Vector3;
        isTarget: boolean;
      };
      const blocks: Block[] = [];
      GRID.forEach((cols, row) =>
        cols.forEach((kind, col) => {
          if (!kind) return;
          const material = makeMaterial(kind);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          group.add(mesh);
          blocks.push({
            mesh,
            material,
            col,
            row,
            lift: LIFT[kind],
            boost: 0,
            off: new THREE.Vector3(),
            vel: new THREE.Vector3(),
            rot: new THREE.Vector3(),
            rotVel: new THREE.Vector3(),
            isTarget: row === TARGET.row && col === TARGET.col,
          });
        })
      );
      const target = blocks.find((b) => b.isTarget)!;
      const nextBg = new THREE.Color(NEXT_BG);

      // ── 크기 · 입력 상태
      let w = 0;
      let h = 0;
      let heroH = 1;
      let enabled = false;
      // 히어로의 글: 큐브가 커지며 뒤를 지나가기 전에 흐려진다
      const copy = document.getElementById("hero-copy");
      let copyOpacity = 1;
      const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };

      const measure = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        enabled = w >= 1024;
        heroH = document.getElementById("top")?.offsetHeight ?? h;
        renderer.setSize(w, h, false);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
      };
      measure();

      const onMove = (e: PointerEvent) => {
        // 화면 중심 기준, y는 위가 +
        pointer.tx = e.clientX - w / 2;
        pointer.ty = h / 2 - e.clientY;
        pointer.inside = true;
      };
      const onLeave = () => (pointer.inside = false);

      const local = new THREE.Vector3();
      const dir = new THREE.Vector3();
      const inv = new THREE.Matrix4();
      const tmp = new THREE.Vector3();
      // 마우스 아래의 좌표(묶음 기준, 큐브 중심 높이의 평면)를 구한다
      const pickLocal = (px: number, py: number, out: { x: number; z: number }) => {
        local.set(camera.position.x + px / camera.zoom, camera.position.y + py / camera.zoom, 150);
        dir.set(0, 0, -1);
        inv.copy(group.matrixWorld).invert();
        local.applyMatrix4(inv);
        dir.transformDirection(inv);
        if (Math.abs(dir.y) < 1e-4) return false;
        const t = (0.9 - local.y) / dir.y;
        out.x = local.x + dir.x * t;
        out.z = local.z + dir.z * t;
        return true;
      };

      const onDown = (e: PointerEvent) => {
        if (!enabled || window.scrollY > heroH * 0.3) return;
        const el = e.target as HTMLElement | null;
        if (el?.closest("a,button,input,textarea,header")) return;
        const at = { x: 0, z: 0 };
        pickLocal(e.clientX - w / 2, h / 2 - e.clientY, at);
        for (const b of blocks) {
          tmp.set(b.mesh.position.x - at.x, 0, b.mesh.position.z - at.z);
          const d = Math.max(0.6, tmp.length());
          tmp.normalize().multiplyScalar((7 + Math.random() * 5) / Math.sqrt(d));
          b.vel.x += tmp.x;
          b.vel.z += tmp.z;
          b.vel.y += 6 + Math.random() * 6;
          b.rotVel.set(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16
          );
        }
      };

      window.addEventListener("resize", measure);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);

      // ── 그리기
      const rest = new THREE.Vector3();
      const euler = new THREE.Euler();
      const hit = { x: 0, z: 0 };
      let last = performance.now();
      let raf = 0;
      let shown = false;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;

        const p = clamp01(window.scrollY / heroH);
        const o = enabled ? 1 - smooth(0.03, 0.26, p) : 1;
        if (copy && o !== copyOpacity) {
          copyOpacity = o;
          copy.style.opacity = o === 1 ? "" : o.toFixed(3);
          copy.style.visibility = o === 0 ? "hidden" : "";
        }
        const visible = enabled && p < 1;
        if (canvas.style.visibility !== (visible ? "visible" : "hidden")) {
          canvas.style.visibility = visible ? "visible" : "hidden";
        }
        if (!visible) return;

        // 마우스는 부드럽게 따라간다
        const k = 1 - Math.exp(-dt * 6);
        pointer.x += (pointer.tx - pointer.x) * k;
        pointer.y += (pointer.ty - pointer.y) * k;
        const calm = 1 - smooth(0, 0.3, p); // 스크롤하면 마우스 반응을 줄인다

        // 묶음의 기울기: 비스듬한 시점에서 시작해, 스크롤하면 바로 위에서 내려다본다
        const swing = smooth(0.04, 0.6, p);
        const pitch = lerp(0.72, Math.PI / 2, swing) + (-pointer.y / h) * 0.16 * calm;
        const yaw = lerp(-0.68, 0, swing) + (pointer.x / w) * 0.24 * calm;
        group.rotation.set(pitch, yaw, 0);

        // 크기: 칸 하나가 몇 px인지. 히어로가 60%쯤 올라갔을 때 큐브 하나가 화면보다 커진다
        const cell = Math.min(112, Math.max(64, w * 0.062));
        const zoomEnd = Math.max(w, h) * 1.5;
        camera.zoom = cell * Math.pow(zoomEnd / cell, Math.pow(clamp01(p / 0.62), 1.6));

        // 큐브 배치 · 높이
        const gap = 1.12 + 0.6 * p;
        const time = now / 1000;
        group.updateMatrixWorld();
        const picked = pointer.inside && calm > 0.01 && pickLocal(pointer.x, pointer.y, hit);
        const flat = smooth(0.28, 0.52, p);

        for (const b of blocks) {
          const x = (b.col - 2) * gap;
          const z = (b.row - 2) * gap;
          const phase = (b.col * 1.7 + b.row * 2.3) % 6.283;

          // 마우스 가까이에서 떠오른다
          let want = 0;
          if (picked) {
            const dx = x - hit.x;
            const dz = z - hit.z;
            want = 1.2 * Math.exp(-(dx * dx + dz * dz) / (2 * 1.0 * 1.0)) * calm;
          }
          b.boost += (want - b.boost) * (1 - Math.exp(-dt * 8));
          const bob = Math.sin(time * 1.1 + phase) * 0.09 * calm;

          // 흩어짐 → 스프링으로 되돌아옴
          b.vel.addScaledVector(b.off, -55 * dt).multiplyScalar(Math.exp(-dt * 5.5));
          b.off.addScaledVector(b.vel, dt);
          b.rotVel.addScaledVector(b.rot, -60 * dt).multiplyScalar(Math.exp(-dt * 6));
          b.rot.addScaledVector(b.rotVel, dt);

          const y = 0.5 + (b.lift + bob) * (1 - flat) + b.boost;
          b.mesh.position.set(x + b.off.x, Math.max(0.5, y + b.off.y), z + b.off.z);
          // 가만히 있을 때도 조금씩 흔들려 표면의 비침이 움직인다
          const sway = 0.07 * calm;
          b.mesh.rotation.set(
            b.rot.x + Math.sin(time * 0.8 + phase) * sway + b.boost * 0.12,
            b.rot.y + Math.sin(time * 0.6 + phase * 1.3) * sway * 1.4 + b.boost * 0.25,
            b.rot.z + Math.cos(time * 0.7 + phase) * sway
          );

          // 화면을 채울 큐브는 비침과 조명을 지우고 다음 섹션의 배경색으로 수렴시킨다
          if (b.isTarget) {
            b.material.color.setScalar(1 - flat);
            b.material.emissive.copy(nextBg).multiplyScalar(flat);
          }
        }

        // 카메라 위치: 처음엔 묶음이 화면 오른쪽에, 스크롤하면 목표 큐브가 남은 히어로 영역의 가운데로
        euler.set(pitch, yaw, 0);
        // 쉬고 있을 때 묶음 중심이 놓일 화면 위치(중심 기준 px)
        const restX = w * 0.215;
        const restY = -h * 0.075;
        rest.copy(target.mesh.position).applyEuler(euler);
        const startX = restX + rest.x * camera.zoom;
        const startY = restY + rest.y * camera.zoom;
        const remain = Math.max(0, heroH - window.scrollY); // 아직 화면에 남은 히어로 높이
        const endY = h / 2 - Math.min(h, remain) / 2;
        const move = smooth(0.08, 0.55, p);
        const sx = lerp(startX, 0, move);
        const sy = lerp(startY, endY, move);
        camera.position.x = rest.x - sx / camera.zoom;
        camera.position.y = rest.y - sy / camera.zoom;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          canvas.style.opacity = "1";
        }
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        if (copy) {
          copy.style.opacity = "";
          copy.style.visibility = "";
        }
        window.removeEventListener("resize", measure);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        geometry.dispose();
        blocks.forEach((b) => b.material.dispose());
        floor.geometry.dispose();
        (floor.material as import("three").Material).dispose();
        env.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden h-full w-full opacity-0 transition-opacity duration-700 lg:block"
    />
  );
}
