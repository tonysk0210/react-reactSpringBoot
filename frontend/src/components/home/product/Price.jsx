export default function Price({ currency, price }) {
  return (
    <>
      {currency}
      <span>{Number(price).toFixed(2)}</span>
    </>
  );
}
