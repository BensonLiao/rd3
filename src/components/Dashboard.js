import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {transparentize} from 'polished'
import _ from 'lodash'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import DemoBarChart from 'containers/DemoBarChart'
import DemoPieChart from 'containers/DemoPieChart'
import DemoScatterPlot from 'containers/DemoScatterPlot'
import DemoChat from 'containers/DemoChat'
import withMeasure from 'hocs/withMeasure'

const {string, object, func, arrayOf} = PropTypes
const GridLayout = WidthProvider(ReactGridLayout)
const dimensions = ['width', 'height']
const MeasuredDemoBarChart = withMeasure(dimensions)(DemoBarChart)
const MeasuredDemoScatterPlot = withMeasure(dimensions)(DemoScatterPlot)
const MeasuredDemoPieChart = withMeasure(dimensions)(DemoPieChart)
const MeasuredDemoChat = withMeasure(dimensions)(DemoChat)

const generateDataGroupCSS = colors => {
  return _.reduce(
    colors,
    (result, color, user) => {
      result += `.data-group-${user} { fill: ${color}; }`
      return result
    },
    ''
  )
}

const generateHoverCss = letter =>
  `
  .data-${letter} {
    opacity: 1;
    -webkit-transition: opacity .2s ease-in;
  }
`

const Grid = styled(GridLayout)`
  .axis text {
    fill: ${({ theme }) => theme.color};
  }
  .axis path,
  .axis line {
    fill: none;
    stroke: ${({ theme }) => theme.color};
    shape-rendering: crispEdges;
  }
  .stroked {
    stroke: ${({ theme }) => theme.color};
  }
  .stroked-negative {
    stroke: ${({ theme }) => theme.background};
  }
  ${({ colors }) => generateDataGroupCSS(colors)} .data {
    opacity: ${({ hover }) => (hover ? 0.25 : 1)};
    -webkit-transition: opacity 0.2s ease-in;
  }
  ${({ hover }) =>
    hover && hover.map(letter => generateHoverCss(letter))} .tooltip {
    position: absolute;
    z-index: 10;
    display: inline-block;
    border: solid 1px ${({ theme }) => theme.secondaryColor};
    border-radius: 2px;
    padding: 5px;
    background-color: ${({ theme }) =>
      transparentize(0.2, theme.secondaryBackground)};
    text-align: center;
    color: ${({ theme }) => theme.secondaryColor};
  }
  .react-grid-item > .react-resizable-handle::after {
    content: "";
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-right: 2px solid
      ${({ theme }) => transparentize(0.4, theme.secondaryBackground)};
    border-bottom: 2px solid
      ${({ theme }) => transparentize(0.4, theme.secondaryBackground)};
  }
`;

class Dashboard extends React.Component {
  static defaultProps = {
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);
    this.state = {
      layout: [
        { i: "TL", x: 0, y: 0, w: 6, h: 7 },
        { i: "TR", x: 6, y: 0, w: 6, h: 7 },
        { i: "BL", x: 0, y: 0, w: 6, h: 5 },
        { i: "BR", x: 6, y: 0, w: 6, h: 5 }
      ]
    };
  }

  static propTypes = {
    colors: object,
    hover: arrayOf(string),
    incrementRenderCount: func,
    onLayoutChange: func
  };

  componentDidMount() {
    this.props.incrementRenderCount("component");
    window.addEventListener("resize", this.onWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.incrementRenderCount("component");
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = e => {
    this.forceUpdate();
  };

  onLayoutChange = layout => {
    this.props.onLayoutChange(layout);
  };

  render() {
    const { hover, colors } = this.props;
    const { layout } = this.state;
    return (
      <Grid
        {...this.props}
        className="dashboard"
        hover={hover}
        colors={colors}
        layout={layout}
        onLayoutChange={this.onLayoutChange}
        rowHeight={(window.innerHeight - 29) / 12}
        margin={[0, 0]}
      >
        <div key="TL">
          <MeasuredDemoBarChart />
        </div>
        <div key="TR">
          <MeasuredDemoScatterPlot />
        </div>
        <div key="BL">
          <MeasuredDemoPieChart />
        </div>
        <div key="BR">
          <MeasuredDemoChat />
        </div>
      </Grid>
    );
  }
}

export default Dashboard;
