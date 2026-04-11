import sheepArt from "../assets/sheep-learning-label.png";

/**
 * 3D 느낌 측면 양 일러스트(1024×682) — 몸통에 라벨 오버레이.
 *
 * @param {string} label 예: 단어, 문장
 */
export default function LearningSheep({ label = "" }) {
  return (
    <div className="learning-sheep-photo">
      <img
        src={sheepArt}
        alt=""
        className="learning-sheep-photo__img"
        width={1024}
        height={682}
        decoding="async"
      />
      <span className="learning-sheep-photo__label">{label}</span>
    </div>
  );
}
