import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utilis/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [showArrows, setShowArrows] = useState(false);

	const sliderRef = useRef(null);

	const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

	useEffect(() => {
		const getContent = async () => {
			try {
				setLoading(true);
				setError(false);
				const res = await axios.get(`/api/v1/${contentType}/category/${category}`);
				setContent(res.data.content || []);
			} catch (error) {
				console.error(`Error fetching ${category}:`, error);
				setError(true);
				setContent([]);
			} finally {
				setLoading(false);
			}
		};

		getContent();
	}, [contentType, category]);

	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	const scrollRight = () => {
		sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	if (loading) {
		return (
			<div className='bg-black text-white relative px-5 md:px-20'>
				<h2 className='mb-4 text-2xl font-bold'>
					{formattedCategoryName} {formattedContentType}
				</h2>
				<div className='flex space-x-4 overflow-x-scroll scrollbar-hide'>
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index} className='min-w-[250px] animate-pulse'>
							<div className='bg-gray-800 h-40 rounded-lg'></div>
							<div className='mt-2 h-4 bg-gray-800 rounded'></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-black text-white relative px-5 md:px-20'>
				<h2 className='mb-4 text-2xl font-bold'>
					{formattedCategoryName} {formattedContentType}
				</h2>
				<div className='text-center py-8 text-gray-400'>
					Failed to load content. Please try again later.
				</div>
			</div>
		);
	}

	return (
		<div
			className='bg-black text-white relative px-5 md:px-20'
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className='mb-4 text-2xl font-bold'>
				{formattedCategoryName} {formattedContentType}
			</h2>

			<div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}>
				{content && content.length > 0 ? (
					content.map((item) => (
						<Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
							<div className='rounded-lg overflow-hidden'>
								<img
									src={SMALL_IMG_BASE_URL + item.backdrop_path}
									alt='Movie image'
									className='transition-transform duration-300 ease-in-out group-hover:scale-125'
								/>
							</div>
							<p className='mt-2 text-center'>{item.title || item.name}</p>
						</Link>
					))
				) : (
					<div className='text-center py-8 text-gray-400 w-full'>
						No content available
					</div>
				)}
			</div>

			{showArrows && (
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
};
export default MovieSlider;