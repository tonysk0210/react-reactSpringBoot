import PageTitle from "../home/PageTitle";

export default function About() {
  const h3Style = "text-lg font-semibold text-brand dark:text-light mb-2";
  const pStyle = "text-gray-600 dark:text-lighter";

  return (
    <div className="max-w-6xl min-h-213 mx-auto px-6 py-8 font-brand">
      <PageTitle title="關於我們" />
      {/* 關於我們 */}
      <p className="leading-6 mb-8 text-gray-600 dark:text-lighter">
        <span className="text-lg font-semibold text-brand dark:text-light">
          貼紙商城
        </span>{" "}
        由{" "}
        <span className="text-lg font-semibold text-brand dark:text-light">
          Designs by Anthony{" "}
        </span>
        旗下的創意品牌，我們一心想把那些最熱門、大家最想要的貼紙和海報帶給各位！
      </p>

      <h2 className="text-2xl leading-8 font-bold text-brand dark:text-light mb-6">
        為何選擇我們?
      </h2>

      {/* 特點 */}
      <div className="space-y-8">
        <div>
          <h3 className={h3Style}>優質選材</h3>
          <p className={pStyle}>
            堅持高品質與工藝技術，用心製作每一張貼紙，確保帶給您最完美的產品體驗。
          </p>
        </div>

        <div>
          <h3 className={h3Style}>產品創新</h3>
          <p className={pStyle}>
            我們的乙烯基貼紙擁有頂級的霧面或亮面護膜處理，並採用先進的黏著技術。不僅能耐受各種天氣環境並防刮磨，其溫和的背膠設計更能保護您心愛裝置的表面不受損傷。
          </p>
        </div>

        <div>
          <h3 className={h3Style}>卓越服務</h3>
          <p className={pStyle}>
            客戶滿意度是我們的首要任務。我們致力於提供超乎預期的購物體驗，確保每一位顧客都能感受到我們的用心。
          </p>
        </div>

        <div>
          <h3 className={h3Style}>精心設計</h3>
          <p className={pStyle}>
            我們擁有超過 1,000
            款設計，風格從引發共鳴、幽默風趣到搞怪創意應有盡有。而這僅僅是個開始——請持續關注，更多精彩的產品與設計即將登場！
          </p>
        </div>
      </div>
    </div>
  );
}
