import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Play, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const WatchPage = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMovie = async () => {
			try {
				const response = await axios.get(`/api/v1/movie/${id}`);
				setMovie(response.data.movie);
			} catch (error) {
				toast.error("Failed to load movie");
				console.error("Error fetching movie:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMovie();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="text-white text-center">
					<h1 className="text-2xl font-bold mb-4">Movie not found</h1>
					<Link to="/" className="text-red-600 hover:text-red-400">
						Go back home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black">
			{/* Header */}
			<div className="relative z-10 p-4">
				<Link
					to="/"
					className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
				>
					<ArrowLeft className="w-6 h-6 mr-2" />
					Back to Browse
				</Link>
			</div>

			{/* Hero Section */}
			<div className="relative h-screen">
				{/* Background Image */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
					}}
				>
					<div className="absolute inset-0 bg-black bg-opacity-60"></div>
				</div>

				{/* Content */}
				<div className="relative z-10 h-full flex items-center">
					<div className="container mx-auto px-4">
						<div className="max-w-2xl">
							<h1 className="text-5xl font-bold text-white mb-4">
								{movie.title}
							</h1>
							<p className="text-lg text-gray-300 mb-6">
								{movie.overview}
							</p>
							<div className="flex items-center space-x-4 mb-6">
								<span className="text-green-400 font-semibold">
									{movie.vote_average?.toFixed(1)} Rating
								</span>
								<span className="text-gray-400">
									{movie.release_date?.split("-")[0]}
								</span>
								<span className="text-gray-400">
									{movie.runtime} min
								</span>
							</div>
							<button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold flex items-center transition-colors">
								<Play className="w-5 h-5 mr-2" />
								Play
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WatchPage; 