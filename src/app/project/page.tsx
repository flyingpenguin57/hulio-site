'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  github: string;
  picture: string;
  created_time: string;
  updated_time: string;
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 写死的项目数据
  const projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing with Stripe, real-time inventory management, and a comprehensive admin dashboard.',
      url: 'https://ecommerce-demo.com',
      github: 'https://github.com/username/ecommerce-platform',
      picture: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      created_time: '2024-01-15T10:00:00Z',
      updated_time: '2024-03-20T14:30:00Z'
    },
    {
      id: 2,
      name: 'Task Management App',
      description: 'Real-time collaborative task management application with Next.js, TypeScript, and Socket.io. Features include real-time updates, user roles, advanced filtering, and drag-and-drop functionality.',
      url: 'https://task-manager-demo.com',
      github: 'https://github.com/username/task-manager',
      picture: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      created_time: '2024-02-10T09:00:00Z',
      updated_time: '2024-04-05T16:45:00Z'
    },
    {
      id: 3,
      name: 'API Gateway Service',
      description: 'High-performance microservices API gateway built with Node.js, Express, and Redis. Features include authentication, rate limiting, request routing, and comprehensive monitoring.',
      url: 'https://api-gateway-demo.com',
      github: 'https://github.com/username/api-gateway',
      picture: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      created_time: '2023-12-05T11:00:00Z',
      updated_time: '2024-02-28T13:20:00Z'
    },
    {
      id: 4,
      name: 'Portfolio Website',
      description: 'Modern portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features include dark mode, responsive design, blog system, and contact forms.',
      url: 'https://portfolio-demo.com',
      github: 'https://github.com/username/portfolio-website',
      picture: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      created_time: '2024-03-01T08:00:00Z',
      updated_time: '2024-05-10T10:15:00Z'
    },
    {
      id: 5,
      name: 'Weather Dashboard',
      description: 'Interactive weather dashboard with real-time data from multiple APIs. Built with React, Chart.js, and OpenWeatherMap API. Features include location search, forecasts, and historical data.',
      url: 'https://weather-dashboard-demo.com',
      github: 'https://github.com/username/weather-dashboard',
      picture: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
      created_time: '2024-01-20T15:00:00Z',
      updated_time: '2024-03-15T12:30:00Z'
    },
    {
      id: 6,
      name: 'Social Media Analytics',
      description: 'Comprehensive social media analytics platform with data visualization, reporting tools, and real-time monitoring. Built with Python, Django, and React.',
      url: 'https://analytics-demo.com',
      github: 'https://github.com/username/social-analytics',
      picture: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      created_time: '2023-11-10T13:00:00Z',
      updated_time: '2024-01-25T09:45:00Z'
    }
  ];

  // 过滤和搜索项目
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'recent') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return matchesSearch && new Date(project.created_time) > threeMonthsAgo;
    }
    if (filter === 'updated') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(project.updated_time) > oneMonthAgo;
    }
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A collection of projects I've built, showcasing my skills in full-stack development, 
            modern technologies, and problem-solving abilities.
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.picture}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Project Links Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {project.name}
                    </h3>
                    <div className="flex space-x-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                          title="Live Demo"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                          title="GitHub Repository"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span title={`Created: ${formatDate(project.created_time)}`}>
                        Created {getTimeAgo(project.created_time)}
                      </span>
                      {project.updated_time !== project.created_time && (
                        <span title={`Updated: ${formatDate(project.updated_time)}`}>
                          Updated {getTimeAgo(project.updated_time)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery 
                ? `No projects found matching "${searchQuery}"`
                : 'No projects found'
              }
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProjects.length} of {projects.length} projects
          {filter !== 'all' && ` (${filter} filter applied)`}
        </div>
      </div>
    </div>
  );
}
