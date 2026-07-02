import "../css-files/ScrollToTop.css";

const ScrollToTop = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="scroll-to-top"
      title="Go to top"
      aria-label="Go to top"
    >
      &#8679;
    </button>
  );
};

export default ScrollToTop;

