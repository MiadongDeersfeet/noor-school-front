import { Link } from "react-router-dom";
import LearningSheep from "./LearningSheep.jsx";

/**
 * 섹션 1 (히어로): 학습 단위 타일 — 귀여운 양 캐릭터 + 라벨
 */
const LEARNING_TILES = [
  { dataType: "word", label: "단어" },
  { dataType: "sentence", label: "" },
  { dataType: "drill", label: "" },
  { dataType: "grammar", label: "" },
  { dataType: "listen", label: "" },
];

export default function HeroSection() {
  return (
    <section className="section s1" id="hero" aria-labelledby="hero-title">
      <div className="section-inner">
        <p className="title1" id="hero-kicker">
          대한민국과 아랍 사이에 다리 놓기
        </p>
        <h1 className="title2" id="hero-title">
          아랍인 대상 한국어 학습 도우미
        </h1>

        <div className="section-img" role="list" aria-label="학습 단위">
          {LEARNING_TILES.map(({ dataType, label }) => {
            const sheep = (
              <span className="section-img-figure">
                <LearningSheep label={label} />
              </span>
            );
            if (dataType === "word") {
              return (
                <Link
                  key={dataType}
                  to="/words/topics"
                  className="section-img-item section-img-item--sheep"
                  data-type={dataType}
                  role="listitem"
                  aria-label={`${label} 학습으로 이동`}
                >
                  {sheep}
                </Link>
              );
            }
            return (
              <div
                key={dataType}
                className="section-img-item section-img-item--sheep"
                data-type={dataType}
                role="listitem"
              >
                {sheep}
              </div>
            );
          })}
        </div>

        <div className="btn-body">
          <div className="pos-relative dp-inline-block">
            <a href="#signup" className="btn btn-top-member-reg">
              ?
            </a>
            <a
              href="https://www.youtube.com/"
              className="youtube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="youtube-icon" aria-hidden="true" />
              <span>누르스쿨 소개</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
