interface DiagramPlaceholderProps {
    label?: string;
}

export function DiagramPlaceholder({ label = 'Diagram Area' }: DiagramPlaceholderProps) {
    return (
        <div className="h-full flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/20 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-hidden rounded-lg lg:rounded-none">
            <div className="text-center">
                <div className="w-full h-64 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-2">{label}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Asset akan ditambahkan nanti</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Scroll narrative untuk melihat perubahan
                </p>
            </div>
        </div>
    );
}
