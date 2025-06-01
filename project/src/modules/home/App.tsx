import { TrendingUp, Calculator, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modules = [
	{
		id: 'financial-dashboard',
		name: 'Financial Analysis',
		description:
			'Comprehensive financial ratio analysis including liquidity, profitability, and solvency metrics. Upload your financial statements or input data manually to get detailed insights into your company\'s financial health.',
		icon: TrendingUp,
		color: 'indigo',
	},
	{
		id: 'business-valuation',
		name: 'Business Valuation',
		description:
			'Calculate your company\'s value using multiple approaches including DCF, comparable company analysis, and asset-based methods. Get detailed insights into what drives your company\'s worth.',
		icon: Calculator,
		color: 'emerald',
	},
	{
		id: 'personal-finance',
		name: 'Personal Finance',
		description:
			'Track your personal income, expenses, and budgets. Set financial goals, monitor spending patterns, and get insights into your financial habits.',
		icon: Wallet,
		color: 'blue',
	},
];

function HomePage() {
	const navigate = useNavigate();

	const handleModuleClick = (moduleId: string) => {
		navigate(`/${moduleId}`);
	};

	return (
		<div className="max-w-7xl mx-auto p-8 space-y-12">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
					Welcome to FinAnalytics
				</h1>
				<p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
					Your comprehensive suite of financial analysis tools. Make informed
					decisions with powerful insights into your company's financial health and
					future prospects.
				</p>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{modules.map((module) => {
					const Icon = module.icon;
					const colorClasses = {
						indigo:
							'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
						emerald:
							'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
						blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
					};

					return (
						<div
							key={module.id}
							className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
							onClick={() => handleModuleClick(module.id)}
							role="button"
							tabIndex={0}
							onKeyPress={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleModuleClick(module.id);
								}
							}}
						>
							<div className="p-6 space-y-4">
								<div
									className={`inline-flex p-3 rounded-lg ${colorClasses[
										module.color as keyof typeof colorClasses
									]}`}
								>
									<Icon className="h-6 w-6" />
								</div>

								<h2 className="text-xl font-bold text-gray-900 dark:text-white">
									{module.name}
								</h2>

								<p className="text-gray-600 dark:text-gray-400">
									{module.description}
								</p>
							</div>

							<div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500 dark:group-hover:border-indigo-400 rounded-xl transition-colors duration-300" />
						</div>
					);
				})}
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Getting Started
				</h2>
				<div className="prose dark:prose-invert max-w-none">
					<ol className="space-y-4">
						<li>
							Select a module from the sidebar navigation or click on a module card
							above
						</li>
						<li>Upload your financial data or enter it manually</li>
						<li>Get instant analysis and insights</li>
						<li>Export your results in various formats</li>
					</ol>
				</div>
			</div>
		</div>
	);
}

export default HomePage;