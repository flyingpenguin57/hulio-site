'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/app/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [publishLoading, setPublishLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects...');
      const projectsData = await ProjectService.getAllProjects();
      console.log('Fetched projects:', projectsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await ProjectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePublish = async (id: number) => {
    setPublishLoading(id);
    try {
      console.log('Publishing project with ID:', id);
      const updatedProject = await ProjectService.updateProject(id, { status: 1 });
      console.log('Project updated successfully:', updatedProject);
      
      setProjects(prev => {
        const newProjects = prev.map(project => 
          project.id === id ? { ...project, status: 1 } : project
        );
        console.log('Updated projects state:', newProjects);
        return newProjects;
      });
      
      alert('Project published successfully');
    } catch (error) {
      console.error('Error publishing project:', error);
      alert('Failed to publish project');
    } finally {
      setPublishLoading(null);
    }
  };

  const handleSaveAsDraft = async (id: number) => {
    setPublishLoading(id);
    try {
      console.log('Saving project as draft with ID:', id);
      const updatedProject = await ProjectService.updateProject(id, { status: 0 });
      console.log('Project updated successfully:', updatedProject);
      
      setProjects(prev => {
        const newProjects = prev.map(project => 
          project.id === id ? { ...project, status: 0 } : project
        );
        console.log('Updated projects state:', newProjects);
        return newProjects;
      });
      
      alert('Project saved as draft successfully');
    } catch (error) {
      console.error('Error saving project as draft:', error);
      alert('Failed to save project as draft');
    } finally {
      setPublishLoading(null);
    }
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Published
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Draft
        </span>
      );
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading projects...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage all your projects</p>
            </div>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Project
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {projects.filter(project => project.status === 1).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {projects.filter(project => project.status === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">All Projects</h2>
          </div>
          
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.picture && (
                            <img 
                              className="h-10 w-10 rounded-lg object-cover mr-3" 
                              src={project.picture} 
                              alt={project.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(project.created_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(project.updated_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Edit Button */}
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>

                          {/* Publish/Draft Toggle */}
                          {project.status === 1 ? (
                            <button
                              onClick={() => handleSaveAsDraft(project.id)}
                              disabled={publishLoading === project.id}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors duration-200 disabled:opacity-50"
                              title="Save as Draft"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublish(project.id)}
                              disabled={publishLoading === project.id}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 disabled:opacity-50"
                              title="Publish"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(project.id)}
                            disabled={deleteLoading === project.id}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                            title="Delete"
                          >
                            {deleteLoading === project.id ? (
                              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                No projects yet
              </div>
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
