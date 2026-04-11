import { Link } from "react-router-dom";

/**
 * 섹션 1 (히어로): 타일 데이터는 API/번들로 분리하기 쉽게 상수 배열로 둡니다.
 * 이미지로 교체 시: 아래 map 안을 <img className="section-img-item" data-type={...} /> 로 바꾸면 됩니다.
 */
const LEARNING_TILES = [
  { dataType: "word", label: "단어" },
  { dataType: "sentence", label: "문장" },
  { dataType: "drill", label: "드릴" },
  { dataType: "grammar", label: "문법" },
  { dataType: "listen", label: "듣기" },
];

export default function HeroSection() {
  return (
    <section className="section s1" id="hero" aria-labelledby="hero-title">
      <div className="section-inner">
        <p className="title1" id="hero-kicker">
          대한민국과 아랍 사이에 다리를 놓는 사람들
        </p>
        <h1 className="title2" id="hero-title">
          한국어 교육으로 아랍을 밝히자
        </h1>

        <div className="section-img" role="list" aria-label="학습 단위">
          {LEARNING_TILES.map(({ dataType, label }) => {
            const labelEl = <span className="tile-label">{label}</span>;
            if (dataType === "word") {
              return (
                <Link
                  key={dataType}
                  to="/words/topics"
                  className="section-img-item tile"
                  data-type={dataType}
                  role="listitem"
                >
                  {labelEl}
                </Link>
              );
            }
            return (
              <div
                key={dataType}
                className="section-img-item tile"
                data-type={dataType}
                role="listitem"
              >
                {labelEl}
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
