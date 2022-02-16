import './App.css';
import Navbar from './Navbar';
import Graph from './Graph';

function App() {
  const graphData = [
    {
      link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart.html',
      h: '525',
      w: '30%'
    },
    {
      link: 'https://mikepmerritt.github.io/DashboardTesting/pie_chart_actionable.html',
      h: '525',
      w: '30%'
    },
    {
      link: 'https://mikepmerritt.github.io/DashboardTesting/pillar_chart.html',
      h: '525',
      w: '30%'
    }
  ];

  return (
    <div className="App">
      <Navbar />

      <div className="content">
        <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
        <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
        <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
        <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
        <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
        <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
        <Graph link={graphData[0].link} h={graphData[0].h} w={graphData[0].w} />
        <Graph link={graphData[1].link} h={graphData[1].h} w={graphData[1].w} />
        <Graph link={graphData[2].link} h={graphData[2].h} w={graphData[2].w} />
      </div>
    </div>
  );
}

export default App;
