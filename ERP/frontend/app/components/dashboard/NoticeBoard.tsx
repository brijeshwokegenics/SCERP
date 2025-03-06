'use client';

import React, { useState, useEffect } from "react";
import NoticeList from "../notice/NoticeList";
export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch notices from backend whenever the search query changes
    const fetchNotices = async () => {
      const response = await fetch(`http://localhost:5000/api/notices?searchQuery=${searchQuery}`);
      const data = await response.json();
      setNotices(data);
    };

    fetchNotices();
  }, [searchQuery]);
    return (
      <div className="bg-white shadow-md p-4 rounded-md">
      {/* <NoticeList  notices={notices} searchQuery={searchQuery} /> */}
      </div>
    );
  }
  