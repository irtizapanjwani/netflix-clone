import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { contentType } = useContentStore();

	useEffect(() => {
		const getTrendingContent = async () => {
			try {
				setLoading(true);
				setError(false);
				const res = await axios.get(`/api/v1/${contentType}/trending`);
				setTrendingContent(res.data.content);
			} catch (error) {
				console.error('Error fetching trending content:', error);
				setError(true);
				setTrendingContent(null);
			} finally {
				setLoading(false);
			}
		};

		getTrendingContent();
	}, [contentType]);

	return { trendingContent, loading, error };
};
export default useGetTrendingContent;