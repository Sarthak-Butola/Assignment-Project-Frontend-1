import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addInfo } from '../utils/editIssueslice';

const IssueList = ({ issue }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { _id, title, description, status, priority, createdAt } = issue;

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
      if (!confirmDelete) return;
      await axios.delete(BASE_URL + "/issues/delete/" + _id);
      alert("Issue successfully deleted");
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Helper to shorten the description
  const getShortDescription = (text, maxLength = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 m-auto border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition p-4"
      >
        {/* Always Visible Summary */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {getShortDescription(description)}
            </p>
            <p className="text-xs text-gray-400">ID: {_id}</p>
          </div>
          <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
            <span
              className={`text-sm font-medium px-2 py-1 rounded text-center w-fit mb-1 ${
                status === 'Open'
                  ? 'bg-red-100 text-red-600'
                  : status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {status}
            </span>
            <span
              className={`text-sm font-semibold ${
                priority === 'High'
                  ? 'text-red-600'
                  : priority === 'Medium'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              Priority: {priority}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isOpen && (
          <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
            <p className='break-words'>
              <strong>Full Description:</strong> {description}
            </p>
            <div className="flex gap-2">
              <button
                className="text-sm px-4 py-2 bg-black text-white rounded hover:cursor-pointer hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addInfo({ _id, title, description, status, priority }));
                  navigate('/editIssue');
                }}
              >
                Edit Issue
              </button>

              <button
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:cursor-pointer hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete Issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueList;
