type CardTypeProps = {
  cardType: string;
}

function CardType({cardType}: CardTypeProps): JSX.Element {
  return (
    <p className="place-card__type">{cardType.replace(/^./, (char) => char.toUpperCase())}</p>
  );
}

export {CardType};
