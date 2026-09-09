export default function NodeChain({
  nodes,
  currentIndex,
  renderLabel,
  bidirectional = false,
}) {
  return (
    <div className="node-chain" role="list">
      {nodes.map((value, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div className="node-chain__item" key={index} role="listitem">
            <div className={`node-box${isCurrent ? " node-box--active" : ""}`}>
              <span className="node-box__index">#{index}</span>
              <span className="node-box__label">{renderLabel(value)}</span>
            </div>

            {index < nodes.length - 1 && (
              <div className="node-connector">
                <span className="node-connector__arrow">next</span>
                {bidirectional && (
                  <span className="node-connector__arrow">prev</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
