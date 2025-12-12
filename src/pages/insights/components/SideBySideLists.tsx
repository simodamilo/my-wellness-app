type Item = {
    date: number;   // ISO date or any string
    x: number;      // 0 or 1
    y: number;      // rating (0–10)
};

type Props = {
    data: Item[];
};

export const SideBySideLists = ({ data }: Props) => {
    if (!data || !data.length) return null;

    const group0 = data.filter(item => item.x === 0);
    const group1 = data.filter(item => item.x === 1);

    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {/* LEFT COLUMN — X = 0 */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Days with X = 0
                </h2>
                <ul className="space-y-2">
                    {group0.map((item, index) => (
                        <li
                            key={index}
                            className="p-3 bg-white rounded-lg border shadow-sm flex justify-between flex-col"
                        >
                            <span className="text-gray-600">{new Date(item.date*1000).toLocaleDateString()}</span>
                            <span className="font-medium text-gray-900">Y: {item.y}</span>
                        </li>
                    ))}
                    {group0.length === 0 && (
                        <p className="text-gray-500 italic">No entries.</p>
                    )}
                </ul>
            </div>

            {/* RIGHT COLUMN — X = 1 */}
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    Days with X = 1
                </h2>
                <ul className="space-y-2">
                    {group1.map((item, index) => (
                        <li
                            key={index}
                            className="p-3 bg-white rounded-lg border shadow-sm flex justify-between flex-col"
                        >
                            <span className="text-gray-600">{new Date(item.date*1000).toLocaleDateString()}</span>
                            <span className="font-medium text-gray-900">Y: {item.y}</span>
                        </li>
                    ))}
                    {group1.length === 0 && (
                        <p className="text-gray-500 italic">No entries.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
