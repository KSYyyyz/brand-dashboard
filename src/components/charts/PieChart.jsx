import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#c9a962', '#d4b978', '#8b7355', '#6b5b4f', '#4a4a4a']

export default function PieChartComponent({ data, dataKey = 'value', nameKey = 'name', height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
