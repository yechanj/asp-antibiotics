/* =========================================================
   ASP 항생제 학습 — 공통 인터랙션 (바닐라 JS)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. 모바일 사이드바 드로어 ---------- */
  function initSidebar() {
    var sidebar = document.querySelector(".sidebar");
    var burger = document.querySelector(".hamburger");
    var scrim = document.querySelector(".scrim");
    if (!sidebar || !burger) return;

    function open() {
      sidebar.classList.add("open");
      if (scrim) scrim.classList.add("show");
      burger.setAttribute("aria-expanded", "true");
    }
    function close() {
      sidebar.classList.remove("open");
      if (scrim) scrim.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function () {
      sidebar.classList.contains("open") ? close() : open();
    });
    if (scrim) scrim.addEventListener("click", close);
    // 하단 내비 등에서 목차 열기
    document.querySelectorAll("[data-open-toc]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        sidebar.classList.contains("open") ? close() : open();
      });
    });
    // 목차 클릭 시 모바일에서 닫기
    sidebar.querySelectorAll(".toc a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 860px)").matches) close();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- 2. 스크롤스파이 (현재 섹션 하이라이트) ---------- */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".toc a[href^='#']")
    );
    if (!links.length) return;
    var map = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) {
        map[id] = a;
        sections.push(el);
      }
    });

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("active"); });
            var active = map[en.target.id];
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- 3. Spectrum toggle ---------- */
  /* data는 HTML의 data-* 속성이 아닌 아래 객체에서 관리 */
  var SPECTRUM = {
    Ampicillin: {
      cover: { "Gram-positive": "yes", Enterococcus: "strong", Enterobacterales: "partial", Pseudomonas: "no", Anaerobes: "partial", MRSA: "no", Atypical: "no" },
      note: "Enterococcus · Listeria를 대표적으로 연상."
    },
    "Ampicillin/Sulbactam": {
      cover: { "Gram-positive": "yes", Enterococcus: "yes", Enterobacterales: "yes", Pseudomonas: "no", Anaerobes: "yes", MRSA: "no", Atypical: "no" },
      note: "GP + GN + anaerobe. 단, Pseudomonas는 안 된다."
    },
    "Piperacillin/Tazobactam": {
      cover: { "Gram-positive": "yes", Enterococcus: "yes", Enterobacterales: "yes", Pseudomonas: "strong", Anaerobes: "strong", MRSA: "no", Atypical: "no" },
      note: "광범위 + Pseudomonas + anaerobe. MRSA는 못 잡는다."
    },
    Cefazolin: {
      cover: { "Gram-positive": "strong", Enterococcus: "no", Enterobacterales: "partial", Pseudomonas: "no", Anaerobes: "no", MRSA: "no", Atypical: "no" },
      note: "MSSA를 강하게 연상. Surgical prophylaxis."
    },
    Ceftriaxone: {
      cover: { "Gram-positive": "yes", Enterococcus: "no", Enterobacterales: "strong", Pseudomonas: "no", Anaerobes: "no", MRSA: "no", Atypical: "no" },
      note: "구멍 3개: MRSA X · Enterococcus X · Pseudomonas X."
    },
    Ceftazidime: {
      cover: { "Gram-positive": "partial", Enterococcus: "no", Enterobacterales: "strong", Pseudomonas: "strong", Anaerobes: "no", MRSA: "no", Atypical: "no" },
      note: "3세대 중 Pseudomonas를 강하게 연상 (GP는 약함)."
    },
    Cefepime: {
      cover: { "Gram-positive": "yes", Enterococcus: "no", Enterobacterales: "strong", Pseudomonas: "strong", Anaerobes: "no", MRSA: "no", Atypical: "no" },
      note: "Pseudomonas O. 신기능 저하 시 neurotoxicity 주의."
    },
    Ertapenem: {
      cover: { "Gram-positive": "yes", Enterococcus: "no", Enterobacterales: "strong", Pseudomonas: "no", Anaerobes: "strong", MRSA: "no", Atypical: "no" },
      note: "Carbapenem이지만 Pseudomonas는 못 잡는다."
    },
    Meropenem: {
      cover: { "Gram-positive": "yes", Enterococcus: "no", Enterobacterales: "strong", Pseudomonas: "strong", Anaerobes: "strong", MRSA: "no", Atypical: "no" },
      note: "매우 광범위. 단 MRSA X · VRE X. ASP 관리 대상 1순위."
    }
  };
  var ORG_ORDER = ["Gram-positive", "Enterobacterales", "Pseudomonas", "Anaerobes", "Enterococcus", "MRSA", "Atypical"];
  var MARK = { strong: "◎", yes: "O", partial: "△", no: "✕" };

  function initSpectrumToggle() {
    var root = document.querySelector("[data-spectoggle]");
    if (!root) return;
    var listEl = root.querySelector(".spectoggle__list");
    var gridEl = root.querySelector(".orggrid");
    var metaEl = root.querySelector(".spectoggle__meta");

    // 버튼 생성
    Object.keys(SPECTRUM).forEach(function (drug, i) {
      var b = document.createElement("button");
      b.className = "drugbtn" + (i === 0 ? " active" : "");
      b.type = "button";
      b.textContent = drug;
      b.setAttribute("data-drug", drug);
      listEl.appendChild(b);
    });
    // 셀 생성
    ORG_ORDER.forEach(function (org) {
      var c = document.createElement("div");
      c.className = "orgcell";
      c.setAttribute("data-org", org);
      c.innerHTML = "<span>" + org + "</span><span class='mark'></span>";
      gridEl.appendChild(c);
    });

    function render(drug) {
      var d = SPECTRUM[drug];
      gridEl.querySelectorAll(".orgcell").forEach(function (cell) {
        var org = cell.getAttribute("data-org");
        var lvl = d.cover[org] || "no";
        cell.className = "orgcell cov-" + lvl;
        cell.querySelector(".mark").textContent = MARK[lvl];
      });
      if (metaEl) metaEl.innerHTML = "<b>" + drug + "</b> — " + d.note;
    }

    listEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".drugbtn");
      if (!btn) return;
      listEl.querySelectorAll(".drugbtn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      render(btn.getAttribute("data-drug"));
    });
    render(Object.keys(SPECTRUM)[0]);
  }

  /* ---------- 4. Cephalosporin generation slider ---------- */
  var GENS = [
    { g: "1세대", drug: "Cefazolin", pts: ["MSSA를 강하게 연상", "Streptococcus, 일부 Enterobacterales", "MRSA X · Enterococcus X · Pseudomonas X", "Surgical prophylaxis"] },
    { g: "2세대", drug: "Cefuroxime / Cefoxitin", pts: ["Cefoxitin은 일부 anaerobic coverage", "복강 내 감염·수술 예방 맥락에서 접함"] },
    { g: "3세대", drug: "Ceftriaxone / Ceftazidime", pts: ["Ceftriaxone: CAP·pyelonephritis·meningitis", "구멍: MRSA X · Enterococcus X · Pseudomonas X", "Ceftazidime은 Pseudomonas O (예외적)"] },
    { g: "4세대", drug: "Cefepime", pts: ["Gram-positive 일부 + 많은 GN + Pseudomonas", "MRSA X · Enterococcus X · anaerobe 부족", "신기능 저하 시 neurotoxicity 주의"] }
  ];
  function initGenSlider() {
    var root = document.querySelector("[data-genslider]");
    if (!root) return;
    var input = root.querySelector("input[type=range]");
    var card = root.querySelector(".gen-card");
    var steps = root.querySelectorAll(".gen-steps span");

    function render(i) {
      var g = GENS[i];
      card.innerHTML =
        "<h4>" + g.g + " Cephalosporin</h4>" +
        "<div class='gen-drug'>" + g.drug + "</div>" +
        "<ul>" + g.pts.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>";
      steps.forEach(function (s, idx) { s.classList.toggle("on", idx === i); });
    }
    input.addEventListener("input", function () { render(parseInt(input.value, 10)); });
    render(parseInt(input.value, 10));
  }

  /* ---------- 5. De-escalation animation ---------- */
  function initDeesc() {
    var root = document.querySelector("[data-deesc]");
    if (!root) return;
    var stage = root.querySelector(".deesc__stage");
    var result = root.querySelector(".deesc__result");
    var steps = root.querySelector(".deesc__steps");
    var playBtn = root.querySelector("[data-deesc-play]");
    var resetBtn = root.querySelector("[data-deesc-reset]");

    function reset() {
      stage.innerHTML =
        "<span class='drugpill' data-role='vanco'>Vancomycin</span>" +
        "<span class='drugpill' data-role='ptz'>Piperacillin/Tazobactam</span>";
      result.textContent = "";
      if (steps) steps.style.display = "none";
    }
    function play() {
      reset();
      if (steps) steps.style.display = "grid";
      setTimeout(function () {
        result.textContent = "Culture: Streptococcus pneumoniae 확인 → 재평가";
      }, 500);
      setTimeout(function () {
        var vanco = stage.querySelector("[data-role='vanco']");
        if (vanco) vanco.classList.add("removed");
      }, 1400);
      setTimeout(function () {
        var ptz = stage.querySelector("[data-role='ptz']");
        if (ptz) {
          ptz.classList.add("removed");
        }
      }, 2100);
      setTimeout(function () {
        var pill = document.createElement("span");
        pill.className = "drugpill narrow";
        pill.textContent = "Ceftriaxone";
        pill.style.opacity = "0";
        stage.appendChild(pill);
        requestAnimationFrame(function () { pill.style.opacity = "1"; });
        result.textContent = "De-escalation 완료 — 필요한 spectrum만 남긴다.";
      }, 2700);
    }
    if (playBtn) playBtn.addEventListener("click", play);
    if (resetBtn) resetBtn.addEventListener("click", reset);
    reset();
  }

  /* ---------- 6. Quiz reveal ---------- */
  function initQuiz() {
    document.querySelectorAll(".qcard .reveal-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ans = btn.parentElement.querySelector(".answer");
        if (!ans) return;
        var shown = ans.classList.toggle("show");
        btn.textContent = shown ? "정답 숨기기" : "정답 보기";
      });
    });
  }

  /* ---------- 7. MCQ (미니 케이스) ---------- */
  function initMCQ() {
    document.querySelectorAll(".mcq").forEach(function (list) {
      var answer = list.getAttribute("data-answer");
      list.querySelectorAll("li").forEach(function (li) {
        li.addEventListener("click", function () {
          if (list.getAttribute("data-done")) return;
          list.setAttribute("data-done", "1");
          list.querySelectorAll("li").forEach(function (x) {
            if (x.getAttribute("data-opt") === answer) x.classList.add("correct");
          });
          if (li.getAttribute("data-opt") !== answer) li.classList.add("wrong");
          var exp = list.parentElement.querySelector(".mcq-exp");
          if (exp) exp.style.display = "block";
        });
      });
    });
  }

  /* ---------- 8. 대형 표 약물명 팝업 ---------- */
  var DRUG_POP = {
    Ampicillin: { strong: "Enterococcus, Streptococcus", weak: "Pseudomonas", assoc: "Enterococcus + Listeria" },
    "Ampicillin/Sulbactam": { strong: "GP·GN·anaerobe", weak: "Pseudomonas", assoc: "혼합 감염 · 흡인성 폐렴" },
    "Piperacillin/Tazobactam": { strong: "GN·Pseudomonas·anaerobe", weak: "MRSA", assoc: "중증 empiric therapy" },
    Cefazolin: { strong: "MSSA", weak: "MRSA·Enterococcus·Pseudomonas", assoc: "MSSA 감염 · 수술 예방" },
    Ceftriaxone: { strong: "Enterobacterales·Streptococcus", weak: "MRSA·Enterococcus·Pseudomonas", assoc: "CAP · pyelonephritis · meningitis" },
    Ceftazidime: { strong: "Pseudomonas·Enterobacterales", weak: "GP(약함)·anaerobe", assoc: "Pseudomonas coverage 필요 시" },
    Cefepime: { strong: "Enterobacterales·Pseudomonas", weak: "MRSA·Enterococcus·anaerobe", assoc: "Pseudomonas + neurotoxicity 주의" },
    Ertapenem: { strong: "Enterobacterales·ESBL·anaerobe", weak: "Pseudomonas·Acinetobacter", assoc: "Pseudomonas 불필요한 복강내 감염" },
    Meropenem: { strong: "GN·ESBL·Pseudomonas·anaerobe", weak: "MRSA·VRE", assoc: "ASP 관리 1순위 광범위 β-lactam" }
  };
  function initTablePopup() {
    var popup = document.querySelector(".popup");
    if (!popup) return;
    function showFor(el) {
      var name = el.getAttribute("data-drug");
      var d = DRUG_POP[name];
      if (!d) return;
      popup.innerHTML =
        "<h5>" + name + "</h5>" +
        "<div class='row'><b>강점</b> " + d.strong + "</div>" +
        "<div class='row'><b>약점</b> " + d.weak + "</div>" +
        "<div class='row'><b>연상</b> " + d.assoc + "</div>";
      var r = el.getBoundingClientRect();
      popup.classList.add("show");
      var pw = popup.offsetWidth, ph = popup.offsetHeight;
      var left = Math.min(r.left, window.innerWidth - pw - 12);
      var top = r.bottom + 8;
      if (top + ph > window.innerHeight) top = r.top - ph - 8;
      popup.style.left = Math.max(8, left) + "px";
      popup.style.top = Math.max(8, top) + "px";
    }
    function hide() { popup.classList.remove("show"); }

    document.querySelectorAll(".drugname").forEach(function (el) {
      el.addEventListener("mouseenter", function () { showFor(el); });
      el.addEventListener("mouseleave", hide);
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        popup.classList.contains("show") ? hide() : showFor(el);
      });
    });
    document.addEventListener("click", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- 9. 균 선택기 / 일반 selector ---------- */
  function initSelectors() {
    document.querySelectorAll("[data-selector]").forEach(function (root) {
      var btns = root.querySelectorAll(".sel-btn");
      var panels = root.querySelectorAll(".sel-panel");
      function show(target) {
        btns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-target") === target); });
        panels.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-panel") === target); });
      }
      btns.forEach(function (b) {
        b.addEventListener("click", function () { show(b.getAttribute("data-target")); });
      });
      if (btns.length) show(btns[0].getAttribute("data-target"));
    });
  }

  /* ---------- 10. Clinical Decision (단계별 공개) ---------- */
  function initDecisions() {
    document.querySelectorAll("[data-decision]").forEach(function (root) {
      var steps = Array.prototype.slice.call(root.querySelectorAll(".dstep"));
      var btn = root.querySelector("[data-decision-next]");
      var resetBtn = root.querySelector("[data-decision-reset]");
      var i = 0;
      function update() {
        steps.forEach(function (s, idx) { s.classList.toggle("show", idx < i); });
        if (btn) {
          if (i >= steps.length) { btn.disabled = true; btn.textContent = "완료"; }
          else { btn.disabled = false; btn.textContent = i === 0 ? "환자 정보 공개 ▸" : "다음 단계 ▸"; }
        }
      }
      function next() { if (i < steps.length) { i++; update(); } }
      function reset() { i = 0; update(); }
      if (btn) btn.addEventListener("click", next);
      if (resetBtn) resetBtn.addEventListener("click", reset);
      reset();
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initSidebar();
    initScrollSpy();
    initSpectrumToggle();
    initGenSlider();
    initDeesc();
    initQuiz();
    initMCQ();
    initTablePopup();
    initSelectors();
    initDecisions();
  });
})();
