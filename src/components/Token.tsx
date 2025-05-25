import { unstable_ViewTransition as ViewTransition } from "react";
import TokenBlue from "src/assets/tokens/tokenBlue.webp";
import TokenBrown from "src/assets/tokens/tokenBrown.webp";
import TokenGray from "src/assets/tokens/tokenGray.webp";
import TokenGreen from "src/assets/tokens/tokenGreen.webp";
import TokenRed from "src/assets/tokens/tokenRed.webp";
import TokenYellow from "src/assets/tokens/tokenYellow.webp";
import { TokenType } from "src/sharedTypes";

const tokenImage = {
  blue: TokenBlue,
  brown: TokenBrown,
  gray: TokenGray,
  green: TokenGreen,
  red: TokenRed,
  yellow: TokenYellow,
};

interface TokenProps extends React.ComponentProps<"img"> {
  token: TokenType;
}
export function Token({ token, ...props }: TokenProps) {
  return (
    <ViewTransition name={token.id}>
      <img
        alt={`${token.color} token`}
        {...props}
        src={tokenImage[token.color]}
      />
    </ViewTransition>
  );
}
