import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="title" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="purchased" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
