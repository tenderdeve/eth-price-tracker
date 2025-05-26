import { ChartOptions } from "chart.js";

export const chartOptions: ChartOptions = {
  legend: { display: false },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 6,
          autoSkip: true,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
          drawBorder: true,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
  
  tooltips: {
    mode: "index",
    intersect: false,
    backgroundColor: "#4B40EE",
    bodyFontColor: "rgba(255,255,255,0.6)",
    displayColors: false,
    callbacks: {
      label: (tooltipItem: any, data: any) => {
        const label = data.datasets[tooltipItem.datasetIndex].label || "";
        const value = tooltipItem.yLabel || "";
        return ` ${label} ${value} ${data.datasets[
          tooltipItem.datasetIndex
        ].vsCurrency.toUpperCase()}`;
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
  },
  plugins: {
    crosshair: {
      line: {
        color: "#4B40EE",
        width: 1,
      },
      sync: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },
  },
};

export const gradientPlugin = {
  beforeDatasetsDraw: (chart: any) => {
    if (!chart.ctx || !chart.chartArea) return;

    const { ctx, chartArea } = chart;
    const { top, bottom } = chartArea;

    chart.data.datasets.forEach((dataset: any) => {
      if (!dataset.gradient || dataset.lastHeight !== bottom) {
        // Create gradient only if it hasn't been created or if chart height changed
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        gradient.addColorStop(0, "rgba(75, 64, 238, 0.8)"); // More visible color
        gradient.addColorStop(0.5, "rgba(75, 64, 238, 0.4)"); // Middle transparency
        gradient.addColorStop(1, "rgba(75, 64, 238, 0)"); // Fully transparent at bottom

        dataset.backgroundColor = gradient; // Apply gradient to dataset fill
        dataset.borderColor = "rgba(75, 64, 238, 1)"; // Ensure line color is solid
        dataset.gradient = gradient; // Store reference
        dataset.lastHeight = bottom;
      }
    });

    chart.update(); // Force re-render
  },
};

export const crosshairPlugin = {
  afterDraw: (chart: any) => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      const tooltip = chart.tooltip;
      const activePoint = tooltip._active[0];

      const x = activePoint.tooltipPosition().x;
      const y = activePoint.tooltipPosition().y;

      const xScale = chart.scales["x-axis-0"];
      const yScale = chart.scales["y-axis-0"];
      if (!xScale || !yScale) return;

      const value = yScale.getValueForPixel(y).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      ctx.save();
      ctx.setLineDash([6, 6]);

      // Draw horizontal dashed line
      ctx.beginPath();
      ctx.moveTo(chart.chartArea.left, y);
      ctx.lineTo(chart.chartArea.right, y);
      ctx.strokeStyle = "#999999";
      ctx.stroke();

      // Draw vertical crosshair (without label)
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.strokeStyle = "#999999";
      ctx.stroke();

      // Label styling for horizontal crosshair
      const padding = 0;
      const tooltipWidth = ctx.measureText(value).width + 30;
      const tooltipHeight = 35;
      const tooltipX = chart.chartArea.right - tooltipWidth - padding;
      const tooltipY = y - tooltipHeight / 2;
      const borderRadius = 10;

      // Draw rounded rectangle
      ctx.fillStyle = "#1A243A";
      ctx.beginPath();
      ctx.moveTo(tooltipX + borderRadius, tooltipY);
      ctx.lineTo(tooltipX + tooltipWidth - borderRadius, tooltipY);
      ctx.arcTo(tooltipX + tooltipWidth, tooltipY, tooltipX + tooltipWidth, tooltipY + borderRadius, borderRadius);
      ctx.lineTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight - borderRadius);
      ctx.arcTo(tooltipX + tooltipWidth, tooltipY + tooltipHeight, tooltipX + tooltipWidth - borderRadius, tooltipY + tooltipHeight, borderRadius);
      ctx.lineTo(tooltipX + borderRadius, tooltipY + tooltipHeight);
      ctx.arcTo(tooltipX, tooltipY + tooltipHeight, tooltipX, tooltipY + tooltipHeight - borderRadius, borderRadius);
      ctx.lineTo(tooltipX, tooltipY + borderRadius);
      ctx.arcTo(tooltipX, tooltipY, tooltipX + borderRadius, tooltipY, borderRadius);
      ctx.fill();

      // Draw text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "Circular Std";
      ctx.textAlign = "center";
      ctx.fillText(value, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2 + 5);

      ctx.restore();
    }
  },
};

export const endOfLineLegendPlugin = {
  afterDraw: (chart: any) => {
    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];

    if (!dataset || dataset.data.length === 0) return;

    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data.length) return;

    const lastPoint = meta.data[meta.data.length - 1]; // Correctly fetch last point
    if (!lastPoint) return;

    const position = lastPoint._model; // Chart.js v2 uses _model for positions
    const x = position.x;
    const y = position.y;

    const lastPrice = dataset.data[dataset.data.length - 1];
    const formattedPrice = parseFloat(lastPrice).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Styling properties
    const fontSize = 16;
    const paddingX = 10;
    const paddingY = 5;
    const borderRadius = 6;
    const textWidth = ctx.measureText(formattedPrice).width;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = fontSize + paddingY * 2;

    ctx.save();

    // Draw rounded rectangle (background)
    ctx.fillStyle = "#4B40EE"; // Same as line color
    ctx.beginPath();
    ctx.moveTo(x, y - boxHeight / 2);
    ctx.lineTo(x + boxWidth - borderRadius, y - boxHeight / 2);
    ctx.arcTo(x + boxWidth, y - boxHeight / 2, x + boxWidth, y + boxHeight / 2, borderRadius);
    ctx.lineTo(x + boxWidth, y + boxHeight / 2 - borderRadius);
    ctx.arcTo(x + boxWidth, y + boxHeight / 2, x + boxWidth - borderRadius, y + boxHeight / 2, borderRadius);
    ctx.lineTo(x + borderRadius, y + boxHeight / 2);
    ctx.arcTo(x, y + boxHeight / 2, x, y + boxHeight / 2 - borderRadius, borderRadius);
    ctx.lineTo(x, y - boxHeight / 2 + borderRadius);
    ctx.arcTo(x, y - boxHeight / 2, x + borderRadius, y - boxHeight / 2, borderRadius);
    ctx.fill();

    // Draw text
    ctx.fillStyle = "#FFFFFF"; // White text
    ctx.font = `${fontSize}px Arial`; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formattedPrice, x + boxWidth / 2, y);

    ctx.restore();
  },
};
