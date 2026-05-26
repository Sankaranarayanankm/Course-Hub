import { Book, CheckCircle, PlayCircle } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CourseCard = (props) => {
  const navigate = useNavigate();
  const { chapters, completedChapters } = props;
  const handleNavigate = () => {
    if (props?.chapters.length === 0) {
      toast.error("Tutor has not added chapters to this course");
      return;
    }

    navigate(`/courses/${props._id}`);
  };

  const progress = Math.floor(
    (completedChapters?.length / chapters?.length) * 100,
  );

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:max-w-sm"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={props.image}
          alt={props.title}
          className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* category */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs px-3 py-1 rounded-full font-medium capitalize">
          {props.category}
        </span>

        {/* purchased badge */}
        {props.isPurchased && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={14} />
            Purchased
          </div>
        )}

        {/* chapters */}
        <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
          <PlayCircle size={18} />
          <span className="text-sm font-medium">
            {props.chapters.length} Chapters
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
          {props.title}
        </h3>

        {/* Description placeholder */}
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          Learn and master {props.category} with practical lessons and
          real-world projects.
        </p>

        {/* Course info */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Book size={16} />
            <span>{props.chapters.length} Lessons</span>
          </div>

          <span className="font-semibold text-slate-900">₹{props.price}</span>
        </div>

        {/* Progress */}
        {!props.isPurchased ? (
          <div className="mt-5 text-2xl font-bold text-slate-900">
            <p className="text-sm font-semibold text-slate-900">
              Purchase to access chapters, and materials
            </p>
            {/* <span className="text-sm font-medium text-slate-700"></span> */}
          </div>
        ) : (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Course Progress</span>
              <span className="font-medium text-slate-700">{progress}%</span>
            </div>

            <progress
              id="chapter-completed"
              value={progress}
              max="100"
              className="w-full h-2 overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-black"
            >
              {progress}%
            </progress>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
