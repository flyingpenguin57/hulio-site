'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectService } from '@/services/projectService';
import { CreateProjectRequest } from '@/app/lib/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
    url: '',
    github: '',
    picture: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsSubmitting(true);
    try {
      const project = await ProjectService.createProject({
        ...formData,
        status: 1 // 发布状态
      });
      console.log('Project created successfully:', project);
      alert('Project created successfully!');
      
      // 跳转到项目管理页面
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    setIsSubmitting(true);
    try {
      const project = await ProjectService.createProject({
        ...formData,
        status: 0 // 草稿状态
      });
      console.log('Project saved as draft:', project);
      alert('Project saved as draft successfully!');
      
      // 跳转到项目管理页面
      router.push('/dashboard/projects');
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Add a new project to your portfolio</p>
            </div>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
          </div>
        </div>

        {/* Project Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                placeholder="Describe your project..."
              />
            </div>

            {/* Project URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://example.com"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Repository
              </label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Project Picture */}
            <div>
              <label htmlFor="picture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Image URL
              </label>
              <input
                type="url"
                id="picture"
                name="picture"
                value={formData.picture}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter a URL to an image that represents your project
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Project
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save as Draft
                  </>
                )}
              </button>
              
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Tips for creating a great project</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use a clear, descriptive project name</li>
                  <li>Write a compelling description that explains what your project does</li>
                  <li>Include both live demo and GitHub links when possible</li>
                  <li>Choose a high-quality image that showcases your project</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
