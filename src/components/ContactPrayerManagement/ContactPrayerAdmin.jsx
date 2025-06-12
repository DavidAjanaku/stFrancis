import React, { useState } from 'react';
import { Search, Filter, Eye, MessageCircle, Calendar, User, Mail, Phone, MapPin, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

const ContactPrayerAdmin = ({ data, setData, editingItem, setEditingItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock data for prayer requests and contact messages
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      type: 'prayer',
      subject: 'Healing Prayer',
      message: 'Please pray for my mother who is recovering from surgery. She needs strength and healing during this difficult time.',
      status: 'pending',
      priority: 'high',
      dateSubmitted: '2024-06-10',
      assignedTo: null,
      response: ''
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael@email.com',
      phone: '(555) 234-5678',
      type: 'contact',
      subject: 'Ministry Inquiry',
      message: 'I would like to learn more about joining the youth ministry. What are the requirements and meeting times?',
      status: 'in-progress',
      priority: 'medium',
      dateSubmitted: '2024-06-09',
      assignedTo: 'Pastor Smith',
      response: 'Thank you for your interest. I will have our Youth Director contact you this week.'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@email.com',
      phone: '(555) 345-6789',
      type: 'prayer',
      subject: 'Family Guidance',
      message: 'Our family is going through a difficult time with job loss. Please pray for wisdom and provision.',
      status: 'completed',
      priority: 'high',
      dateSubmitted: '2024-06-08',
      assignedTo: 'Deacon Williams',
      response: 'We have been praying for your family. Please know that our community support group is here for you.'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james@email.com',
      phone: '(555) 456-7890',
      type: 'contact',
      subject: 'Wedding Planning',
      message: 'My fiancé and I would like to schedule a meeting to discuss our wedding ceremony at the church.',
      status: 'pending',
      priority: 'medium',
      dateSubmitted: '2024-06-11',
      assignedTo: null,
      response: ''
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <MessageCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const handleResponseUpdate = (id, response) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, response, status: response ? 'completed' : req.status } : req
    ));
  };

  const handleDeleteRequest = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    prayers: requests.filter(r => r.type === 'prayer').length,
    contacts: requests.filter(r => r.type === 'contact').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Prayer Requests & Contact Management</h2>
          <p className="text-gray-600 mt-1">View and manage incoming prayer requests and contact messages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.prayers}</div>
          <div className="text-sm text-gray-600">Prayers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-indigo-600">{stats.contacts}</div>
          <div className="text-sm text-gray-600">Contacts</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="prayer">Prayers</option>
              <option value="contact">Contacts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-600">{request.subject}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.type === 'prayer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {request.type === 'prayer' ? 'Prayer' : 'Contact'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{selectedRequest.name}</div>
                      <div className="text-sm text-gray-600">Name</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{selectedRequest.email}</div>
                      <div className="text-sm text-gray-600">Email</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{selectedRequest.phone}</div>
                      <div className="text-sm text-gray-600">Phone</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{new Date(selectedRequest.dateSubmitted).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">Date Submitted</div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
                  <p className="text-gray-700">{selectedRequest.subject}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.message}</p>
                </div>

                {/* Status Management */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusUpdate(selectedRequest.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Response */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                  <textarea
                    value={selectedRequest.response}
                    onChange={(e) => handleResponseUpdate(selectedRequest.id, e.target.value)}
                    placeholder="Enter your response..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="4"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleResponseUpdate(selectedRequest.id, selectedRequest.response);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPrayerAdmin;