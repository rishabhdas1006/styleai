import { Link } from "react-router-dom";

const categories = [
    { label: "MEN", gender: "men" },
    { label: "WOMEN", gender: "women" },
    { label: "KIDS", gender: "kids" },
];

export default function CategoryLinks() {
    return (
        <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
                <Link
                    key={cat.gender}
                    to={`/products?gender=${cat.gender}`}
                    className="text-sm md:text-base font-bold uppercase tracking-wider text-foreground hover:opacity-70 transition-opacity leading-snug"
                >
                    {cat.label}
                </Link>
            ))}
        </div>
    );
}
