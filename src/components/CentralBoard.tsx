import { CSSProperties } from "react";
import CentralBoardImg from "src/assets/centralBoard.webp";
import { Token } from "src/components/Token";
import { PublicGameState } from "src/shared";

const centralBoardStyles: CSSProperties[] = [
  { top: "11%", left: "20%" },
  { top: "11%", left: "62%" },
  { top: "51%", left: "8%" },
  { top: "51%", left: "75%" },
  { top: "74%", left: "41%" },
];

interface CentralBoardProps {
  state: PublicGameState["centralBoard"];
  onClick: (zone: number) => void;
}
export function CentralBoard({ state, onClick }: CentralBoardProps) {
  const width = 450;

  return (
    <div className="relative inline-flex">
      <img src={CentralBoardImg} alt="central board" width={width} />

      {state.map((tokens, index) => {
        const style = centralBoardStyles[index];
        return (
          <BoardZone
            key={index}
            tokens={tokens}
            style={style}
            onClick={() => {
              onClick(index);
            }}
          />
        );
      })}
    </div>
  );
}

const tokenStyles: CSSProperties[] = [
  { position: "absolute", top: 0, left: 0 },
  { position: "absolute", bottom: 0, left: 0 },
  { position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" },
];

interface BoardZoneProps {
  tokens: PublicGameState["centralBoard"][number];
  onClick: () => void;
  style?: CSSProperties;
}
function BoardZone({ tokens, onClick, style }: BoardZoneProps) {
  return (
    <button
      className="absolute flex items-center justify-center hover:bg-black/30"
      onClick={onClick}
      style={{
        width: "20%",
        aspectRatio: "1/1",
        ...style,
      }}
    >
      {tokens.map((token, index) => {
        if (!token) return null;
        const style = tokenStyles[index];
        return <Token key={token.id} token={token} width="50%" style={style} />;
      })}
    </button>
  );
}
