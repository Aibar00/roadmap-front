import React, { useState, useMemo } from 'react';
import './Tree.css';

const Tree = ({ data, onEditRequest, editMode }) => {
  const clonedData = JSON.parse(JSON.stringify(data));
  const positionedTree = assignPositions(clonedData);

  const { maxX, maxY } = findMaxXY(positionedTree);

  const spacingX = 180;
  const spacingY = 105;
  const radius = 23;

  const viewBoxWidth = (maxY + 1) * spacingX + 2 * radius - 70;
  const viewBoxHeight = (maxX + 1) * spacingY + 2 * radius + 150; // Increased to accommodate tooltip below

  return (
    <svg
      viewBox={`-70 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
    >
      <TreeNode
        node={positionedTree}
        spacingX={spacingX}
        spacingY={spacingY}
        radius={radius}
        onEditRequest={onEditRequest}
        editMode={editMode}
        viewBoxWidth={viewBoxWidth}
      />
    </svg>
  );
};

function assignPositions(node, depth = 0, xStart = 0) {
  const subtreeWidth = getSubtreeWidth(node);
  const childWidths = node.children.map(getSubtreeWidth);

  node.x = xStart + subtreeWidth / 2;
  node.y = depth;

  let currentX = xStart;
  for (let i = 0; i < node.children.length; i++) {
    assignPositions(node.children[i], depth + 1, currentX);
    currentX += childWidths[i];
  }

  return node;
}

function getSubtreeWidth(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.map(getSubtreeWidth).reduce((a, b) => a + b, 0);
}

function findMaxXY(node) {
  let maxX = node.x;
  let maxY = node.y;

  for (const child of node.children) {
    const { maxX: childMaxX, maxY: childMaxY } = findMaxXY(child);
    maxX = Math.max(maxX, childMaxX);
    maxY = Math.max(maxY, childMaxY);
  }

  return { maxX, maxY };
}

const TreeNode = ({ node, spacingX, spacingY, radius, onEditRequest, editMode, viewBoxWidth }) => {
  const x = node.y * spacingX + radius;
  const y = node.x * spacingY + radius;

  const rectPaddingX = 12;
  const rectPaddingY = 6;
  const rectYGap = 8;
  const fontSize = 18;
  const maxWidth = 150; // Fixed width
  const estimatedCharWidth = 9;

  const splitValue = useMemo(() => {
    const maxCharsPerLine = Math.floor((maxWidth - 2 * rectPaddingX) / estimatedCharWidth);

    if (node.value.length <= maxCharsPerLine) {
      return [node.value];
    }

    const words = node.value.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }, [node.value]);

  const rectWidth = Math.min(
    maxWidth,
    Math.max(...splitValue.map(line => line.length)) * estimatedCharWidth + 2 * rectPaddingX
  );
  const rectHeight = fontSize * splitValue.length + 2 * rectPaddingY;

  const clipId = `clip-${node.value}-${node.x}-${node.y}`;
  const textStartY = y + radius + rectYGap + rectHeight / 2 - (splitValue.length * fontSize) / 2 + fontSize / 2;
  const startY = y + radius + rectYGap + rectHeight / 2 - splitValue.length * fontSize / 2 + fontSize * 0.8;

  // State for click effect and tooltip visibility on "Java Basics" node
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // Tooltip dimensions and dynamic positioning
  const tooltipWidth = 250;
  const tooltipHeight = 150; // Increased to accommodate video link
  let tooltipX = x - tooltipWidth / 2;
  let tooltipY = y - tooltipHeight - radius - 20; // Default above

  // Adjust tooltip position if it goes out of bounds
  if (tooltipY < 0) {
    tooltipY = y + radius + 20; // Move below if above is out of bounds
  }

  // Ensure tooltip stays within viewBoxWidth
  if (tooltipX < -70) tooltipX = -70;
  if (tooltipX + tooltipWidth > viewBoxWidth) tooltipX = viewBoxWidth - tooltipWidth;

  // Resource details
  const resourceDescription = "A beginner-friendly book to master Java basics.";
  const bookLink = "https://www.rcsdk12.org/cms/lib/NY01001156/Centricity/Domain/4951/Head_First_Java_Second_Edition.pdf";
  const videoLink = "https://www.youtube.com/watch?v=eIrMbAQSU34"; // Example Java tutorial
  const descriptionLines = splitText(resourceDescription, 30);

  return (
    <>
      {/* Lines to children */}
      {node.children.map((child, idx) => (
        <line
          key={idx}
          x1={x}
          y1={y}
          x2={child.y * spacingX + radius}
          y2={child.x * spacingY + radius}
          stroke="white"
          strokeWidth={3}
        />
      ))}

      {/* Circle with click handler for "Java Basics" */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={node.value === 'Java Basics' && isTooltipOpen ? 'rgb(0, 212, 180)' : 'rgb(19, 27, 92)'}
        stroke="white"
        strokeWidth={3}
        onClick={() => node.value === 'Java Basics' && setIsTooltipOpen(!isTooltipOpen)}
      />

      {/* Rect and text */}
      <g>
        <clipPath id={clipId}>
          <rect
            x={x - rectWidth / 2}
            y={y + radius + rectYGap}
            width={rectWidth}
            height={rectHeight}
            rx="6" ry="6"
          />
        </clipPath>

        <rect
          x={x - rectWidth / 2}
          y={y + radius + rectYGap}
          width={rectWidth}
          height={rectHeight}
          fill="#e0f7fa"
          stroke="#006064"
          strokeWidth="1"
          rx="3"
          ry="3"
        />

        <text
          x={x}
          y={startY}
          fontSize={fontSize}
          fill="#006064"
          textAnchor="middle"
          clipPath={`url(#${clipId})`}
        >
          {splitValue.map((line, idx) => (
            <tspan key={idx} x={x} dy={idx === 0 ? 0 : fontSize}>
              {line}
            </tspan>
          ))}
        </text>
      </g>

      {/* Edit buttons above step */}
      {editMode && (
        <>
          <g className="action-circle add" onClick={() => onEditRequest({ action: 'add', parent_id: node.id, node })}>
            <circle cx={x - 34} cy={y - 34} r={12} fill="#8bc34a" />
            <text x={x - 34} y={y - 30} fontSize="12" textAnchor="middle" fill="white">+</text>
          </g>
          <g className="action-circle change" onClick={() => onEditRequest({ action: 'change', step_id: node.id, node })}>
            <circle cx={x} cy={y - 50} r={12} fill="#ff9800" />
            <text x={x} y={y - 46} fontSize="12" textAnchor="middle" fill="white">✎</text>
          </g>
          <g className="action-circle remove" onClick={() => onEditRequest({ action: 'remove', step_id: node.id, node, parent_id: node.parent_id, children: node.children.map(c => c.id)})}>
            <circle cx={x + 34} cy={y - 34} r={12} fill="#f44336" />
            <text x={x + 34} y={y - 30} fontSize="12" textAnchor="middle" fill="white">–</text>
          </g>
        </>
      )}

      {/* Render children */}
      {node.children.map((child, idx) => (
        <TreeNode
          key={idx}
          node={child}
          spacingX={spacingX}
          spacingY={spacingY}
          radius={radius}
          onEditRequest={onEditRequest}
          editMode={editMode}
          viewBoxWidth={viewBoxWidth}
        />
      ))}

      {/* Tooltip for "Java Basics" when clicked, rendered last for stacking */}
      {node.value === 'Java Basics' && isTooltipOpen && (
        <g style={{ zIndex: 1000 }}>
          <rect
            x={tooltipX}
            y={tooltipY}
            width={tooltipWidth}
            height={tooltipHeight}
            rx="8"
            ry="8"
            fill="rgb(10, 15, 50)"
            stroke="rgb(0, 212, 180)"
            strokeWidth="2"
            opacity="0.95"
          />
          <text
            x={tooltipX + 15}
            y={tooltipY + 25}
            fontSize="14"
            fill="rgb(255, 255, 255)"
            textAnchor="start"
          >
            {descriptionLines.map((line, idx) => (
              <tspan key={idx} x={tooltipX + 15} dy={idx === 0 ? 0 : 18}>
                {line}
              </tspan>
            ))}
          </text>
          <a href={bookLink} target="_blank" rel="noopener noreferrer">
            <text
              x={tooltipX + 15}
              y={tooltipY + tooltipHeight - 40}
              fontSize="14"
              fill="rgb(0, 212, 180)"
              textAnchor="start"
              style={{ textDecoration: 'underline' }}
            >
              Head First Java (Book)
            </text>
          </a>
          <a href={videoLink} target="_blank" rel="noopener noreferrer">
            <text
              x={tooltipX + 15}
              y={tooltipY + tooltipHeight - 20}
              fontSize="14"
              fill="rgb(0, 212, 180)"
              textAnchor="start"
              style={{ textDecoration: 'underline' }}
            >
              Java Tutorial (Video)
            </text>
          </a>
        </g>
      )}
    </>
  );
};

// Utility function to split text into lines
function splitText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export default Tree;