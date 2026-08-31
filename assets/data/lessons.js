/* =========================================================
   강의 메타데이터 — 새 강의 추가 시 이 배열에 한 줄만 등록하면
   메인 허브 카드가 자동 생성된다.
   ========================================================= */
window.ASP_LESSONS = [
  {
    no: 1,
    href: "lessons/lesson-01.html",
    title: "항생제 전체 지도와 β-lactam의 기본 구조",
    desc: "항생제를 계열 단위로 보는 법, β-lactam 작용기전·PK/PD, 주요 penicillin·cephalosporin·carbapenem의 spectrum과 ASP 사고방식(de-escalation)까지.",
    tags: ["β-lactam", "Spectrum", "De-escalation", "PK/PD"],
    status: "ready"
  },
  {
    no: 2,
    href: "#",
    title: "(준비 중)",
    desc: "다음 강의가 곧 추가됩니다.",
    tags: [],
    status: "coming"
  }
];

/* 허브 페이지에서 호출: 카드 렌더링 */
window.ASP_renderHub = function (mountSelector) {
  var mount = document.querySelector(mountSelector);
  if (!mount || !window.ASP_LESSONS) return;
  mount.innerHTML = window.ASP_LESSONS.map(function (l) {
    var ready = l.status === "ready";
    var tags = (l.tags || []).map(function (t) {
      return "<span class='lc-tag'>" + t + "</span>";
    }).join("");
    var statusTxt = ready ? "학습 시작 →" : "준비 중";
    var cls = "lesson-card" + (ready ? "" : " disabled");
    var href = ready ? l.href : "#";
    return (
      "<a class='" + cls + "' href='" + href + "'>" +
        "<div class='lc-no'>" + l.no + "강</div>" +
        "<h3>" + l.title + "</h3>" +
        "<p>" + l.desc + "</p>" +
        (tags ? "<div class='lc-tags'>" + tags + "</div>" : "") +
        "<div class='lc-status'>" + statusTxt + "</div>" +
      "</a>"
    );
  }).join("");
};
