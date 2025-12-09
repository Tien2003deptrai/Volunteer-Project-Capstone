import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { MESSAGE_API, NOTIFICATION_API, FRIEND_API } from '@/utils/constant';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  MessageSquare,
  Bell,
  X,
  CheckCircle2
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

const Messages = () => {
  const { user } = useSelector(store => store.auth);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const eventSourceRef = useRef(null);
  const notificationEventSourceRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${MESSAGE_API}/conversations`, {
        withCredentials: true
      });
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${NOTIFICATION_API}?limit=20`, {
        withCredentials: true
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      setLoadingFriends(true);
      const res = await axios.get(`${FRIEND_API}/friends`, {
        withCredentials: true
      });
      if (res.data.success) {
        setFriends(res.data.friends);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load friends");
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  const setupNotificationSSE = useCallback(() => {
    try {
      const eventSource = new EventSource(`${NOTIFICATION_API}/sse`, {
        withCredentials: true
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'new_notification') {
          const newNotification = data.notification;
          setNotifications(prev => {
            // Check if notification already exists to avoid duplicates
            const exists = prev.some(n => n._id === newNotification._id);
            if (exists) return prev;
            return [newNotification, ...prev];
          });
          setUnreadCount(prev => prev + 1);

          // Show toast for friend requests
          if (newNotification.type === 'friend_request') {
            toast.info(`${newNotification.message}`, {
              action: {
                label: 'View',
                onClick: () => setShowNotifications(true)
              }
            });
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error('Notification SSE error:', error);
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            setupNotificationSSE();
          }
        }, 3000);
      };

      notificationEventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to setup notification SSE:', error);
    }
  }, []);

  const setupSSE = useCallback(() => {
    try {
      const eventSource = new EventSource(`${MESSAGE_API}/sse`, {
        withCredentials: true
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'new_message') {
          const newMessage = data.message;

          // Update messages if this conversation is open
          setMessages(prev => {
            if (selectedChat && newMessage.conversation?.toString() === selectedChat) {
              // Check if message already exists to avoid duplicates
              const exists = prev.some(m => m._id === newMessage._id);
              if (exists) return prev;
              return [...prev, newMessage];
            }
            return prev;
          });

          // Update conversation list
          fetchConversations();

          // Show notification
          toast.info(`New message from ${newMessage.sender?.fullname}`);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        // Reconnect after 3 seconds
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            setupSSE();
          }
        }, 3000);
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to setup SSE:', error);
    }
  }, [selectedChat, fetchConversations]);

  useEffect(() => {
    fetchConversations();
    fetchNotifications();
    fetchFriends();
    setupSSE();
    setupNotificationSSE();

    return () => {
      const currentEventSource = eventSourceRef.current;
      if (currentEventSource) {
        currentEventSource.close();
      }
      const currentNotificationEventSource = notificationEventSourceRef.current;
      if (currentNotificationEventSource) {
        currentNotificationEventSource.close();
      }
    };
  }, [fetchConversations, fetchNotifications, fetchFriends, setupSSE, setupNotificationSSE]);

  useEffect(() => {
    if (selectedChat && !selectedChat.toString().startsWith('temp-')) {
      fetchMessages(selectedChat);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`${MESSAGE_API}/conversation/${conversationId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    // Check if it's a temporary conversation (starting new chat with friend)
    let selectedConv = conversations.find(c => c._id === selectedChat);
    let recipientId;

    if (selectedConv && selectedConv._id.toString().startsWith('temp-')) {
      // It's a temporary conversation, get recipient from friend
      recipientId = selectedConv.user._id || selectedConv.user;
    } else if (selectedConv) {
      recipientId = selectedConv.user._id || selectedConv.user;
    } else {
      // Try to find in friends list
      const friend = friends.find(f => f._id === selectedChat || `temp-${f._id}` === selectedChat);
      if (friend) {
        recipientId = friend._id;
      } else {
        return;
      }
    }

    const messageContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      const res = await axios.post(
        `${MESSAGE_API}/send`,
        {
          recipientId: recipientId,
          content: messageContent
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const newMessage = res.data.message;
        setMessages(prev => [...prev, {
          ...newMessage,
          sender: newMessage.sender,
          createdAt: new Date()
        }]);

        // Refresh conversations to get the real conversation
        await fetchConversations();

        // Find the new conversation and select it
        const updatedRes = await axios.get(`${MESSAGE_API}/conversations`, {
          withCredentials: true
        });
        if (updatedRes.data.success) {
          const newConv = updatedRes.data.conversations.find(c =>
            (c.user?._id || c.user) === recipientId
          );
          if (newConv) {
            setSelectedChat(newConv._id);
            setConversations(updatedRes.data.conversations);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send message");
      setMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleAcceptFriendRequest = async (notification) => {
    try {
      const res = await axios.post(
        `${FRIEND_API}/accept`,
        { friendId: notification.relatedUser?._id || notification.relatedUser },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Friend request accepted!");

        // Mark notification as read
        await axios.put(
          `${NOTIFICATION_API}/${notification._id}/read`,
          {},
          { withCredentials: true }
        );

        // Remove notification from list
        setNotifications(prev => prev.filter(n => n._id !== notification._id));
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Refresh conversations and friends to show new friend
        await fetchConversations();
        await fetchFriends();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${NOTIFICATION_API}/${notificationId}/read`,
        {},
        { withCredentials: true }
      );

      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${NOTIFICATION_API}/${notificationId}`,
        { withCredentials: true }
      );

      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete notification");
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const selectedConversation = conversations.find(conv => conv._id === selectedChat) ||
    (selectedChat && selectedChat.startsWith('temp-')
      ? {
        _id: selectedChat,
        user: friends.find(f => `temp-${f._id}` === selectedChat) ||
          friends.find(f => f._id === selectedChat?.replace('temp-', ''))
      }
      : null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 h-[calc(100vh-200px)] flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                  <PopoverTrigger className="relative inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#467057] bg-transparent border-0 p-0">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await axios.put(`${NOTIFICATION_API}/read-all`, {}, { withCredentials: true });
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              setUnreadCount(0);
                              toast.success("All notifications marked as read");
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={notification.relatedUser?.profile?.profilePhoto} />
                                <AvatarFallback className="bg-[#467057] text-white">
                                  {notification.relatedUser?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatTime(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                  )}
                                </div>
                                {notification.type === 'friend_request' && !notification.read && (
                                  <div className="flex gap-2 mt-3">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAcceptFriendRequest(notification)}
                                      className="bg-[#467057] hover:bg-[#2A4B37] text-white text-xs h-7"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteNotification(notification._id)}
                                      className="text-xs h-7"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMarkAsRead(notification._id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDeleteNotification(notification._id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading || loadingFriends ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057]"></div>
                </div>
              ) : conversations.length === 0 && friends.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start following users to message them</p>
                </div>
              ) : (
                <>
                  {/* Existing Conversations */}
                  {conversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => setSelectedChat(conversation._id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === conversation._id ? 'bg-[#467057]/5 border-l-4 border-l-[#467057]' : ''
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-gray-200">
                            <AvatarImage src={conversation.user?.profile?.profilePhoto} />
                            <AvatarFallback className="bg-[#467057] text-white">
                              {conversation.user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.user?.fullname || 'Unknown'}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(conversation.lastMessage?.time || conversation.updatedAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-[#467057] text-white text-xs px-2 py-0.5 flex-shrink-0 ml-2">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Friends List - Show friends who don't have conversations yet */}
                  {friends.length > 0 && (
                    <>
                      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Your Friends</p>
                      </div>
                      {friends
                        .filter(friend => {
                          // Only show friends who don't have a conversation yet
                          return !conversations.some(conv =>
                            (conv.user?._id || conv.user) === friend._id
                          );
                        })
                        .map((friend) => (
                          <div
                            key={friend._id}
                            onClick={async () => {
                              try {
                                // Find or create conversation
                                const existingConv = conversations.find(c =>
                                  (c.user?._id || c.user) === friend._id
                                );

                                if (existingConv) {
                                  setSelectedChat(existingConv._id);
                                } else {
                                  // Create a temporary conversation object for UI
                                  // The actual conversation will be created when first message is sent
                                  const tempConv = {
                                    _id: `temp-${friend._id}`,
                                    user: friend,
                                    lastMessage: null,
                                    unread: 0,
                                    updatedAt: new Date()
                                  };
                                  setSelectedChat(tempConv._id);
                                  // Add to conversations temporarily
                                  setConversations(prev => [tempConv, ...prev]);
                                }
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === `temp-${friend._id}` ? 'bg-[#467057]/5 border-l-4 border-l-[#467057]' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12 border-2 border-gray-200">
                                  <AvatarImage src={friend.profile?.profilePhoto} />
                                  <AvatarFallback className="bg-[#467057] text-white">
                                    {friend.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {friend.fullname || 'Unknown'}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {friend.email || ''}
                                </p>
                                <p className="text-xs text-[#467057] mt-1">Click to start chatting</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 border-2 border-gray-200">
                        <AvatarImage src={selectedConversation?.user?.profile?.profilePhoto} />
                        <AvatarFallback className="bg-[#467057] text-white">
                          {selectedConversation?.user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation?.user?.fullname || 'Unknown'}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation?.user?.email || ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender._id === user?._id || msg.sender === user?._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe
                              ? 'bg-[#467057] text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                              }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <span className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                {formatTime(msg.createdAt)}
                              </span>
                              {isMe && (
                                <span>
                                  {msg.read ? (
                                    <CheckCheck className="h-3 w-3 text-white/70" />
                                  ) : (
                                    <Check className="h-3 w-3 text-white/70" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#467057] hover:bg-[#2A4B37] text-white h-9 px-4"
                      disabled={!message.trim() || sending}
                    >
                      {sending ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile: Show selected chat full screen */}
          {selectedChat && (
            <div className="md:hidden flex-1 flex flex-col absolute inset-0 bg-white z-10">
              {/* Mobile Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-gray-200">
                      <AvatarImage src={selectedConversation?.user?.profile?.profilePhoto} />
                      <AvatarFallback className="bg-[#467057] text-white">
                        {selectedConversation?.user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation?.user?.fullname || 'Unknown'}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation?.user?.email || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === user?._id || msg.sender === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe
                            ? 'bg-[#467057] text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <span className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatTime(msg.createdAt)}
                            </span>
                            {isMe && (
                              <span>
                                {msg.read ? (
                                  <CheckCheck className="h-3 w-3 text-white/70" />
                                ) : (
                                  <Check className="h-3 w-3 text-white/70" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Mobile Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-[#467057] hover:bg-[#2A4B37] text-white h-9 px-4"
                    disabled={!message.trim() || sending}
                  >
                    {sending ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;

