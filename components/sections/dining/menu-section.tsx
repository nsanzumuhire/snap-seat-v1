// Apply specials filter
const displayedItems = showSpecials
    ? filteredItems.filter(item => {
        if (item.tags && (item.tags.includes('special') || item.tags.includes('popular'))) {
            return true;
        }
        if ((item.totalReviews || 0) > 50 && parseFloat((item.totalRating || '0').toString()) >= 4.5) {
            return true;
        }
        if ((item.prepTime || 15) < 15) {
            return true;
        }
        return false;
    })
    : filteredItems;

// Dialog content
{
    item.totalReviews && item.totalReviews > 0 && (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-1">
                <StarHalf className="h-4 w-4" /> Reviews
            </h4>
            <div className="flex items-center gap-2">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < parseInt((item.totalRating || '0').toString())
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-sm">
                    {parseFloat((item.totalRating || '0').toString()).toFixed(1)} ({item.totalReviews} reviews)
                </span>
            </div>
            <div className="mt-2 space-y-2">
                <div className="text-sm bg-gray-50 p-2 rounded-md">
                    <div className="font-medium">John D.</div>
                    <p>Really enjoyed this dish! Would order again.</p>
                </div>
            </div>
        </div>
    )
}

// Menu item card grid view
<div className="flex items-center justify-between">
  <h4 className="font-medium text-sm truncate">{item.name}</h4>
  {reviewStars(parseFloat((item.totalRating || '0').toString()), item.totalReviews || 0)}
</div>

// Menu item card list view
<div className="flex items-center justify-between w-full">
  <h4 className="font-medium text-base">{item.name}</h4>
  {reviewStars(parseFloat((item.totalRating || '0').toString()), item.totalReviews || 0)}
</div>

const reviewStars = (rating: number | null | undefined, totalReviews: number | null | undefined) => {
    if (!totalReviews) return null;

    return (
        <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{parseFloat((rating || 0).toString()).toFixed(1)}</span>
            <span className="text-gray-400">({totalReviews})</span>
        </div>
    );
}; 