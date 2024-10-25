export default function Loading(props) {
  return (
    <div
      {...props}
      className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-primary-500 opacity-70 flex items-center justify-center"
    >
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" stroke="black" width={138} height={138}>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(2 2)" strokeWidth="4">
            <circle strokeOpacity=".1" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
}
