import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RotateCcw, BookOpen } from 'lucide-react';

const AWSPracticeExam = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [examHistory, setExamHistory] = useState([]);

  // Expanded question pool from GitHub repository
  const allQuestions = [
    {
      id: 1,
      question: "You want to run a questionnaire application for only one day (without interruption), which Amazon EC2 purchase option should you use?",
      options: ["Reserved instances", "Spot instances", "Dedicated instances", "On-demand instances"],
      correct: 3,
      explanation: "On-demand instances are best for short-term, irregular workloads that cannot be interrupted."
    },
    {
      id: 2,
      question: "You are working on a project that involves creating thumbnails of millions of images. Consistent uptime is not an issue, and continuous processing is not required. Which EC2 buying option would be the most cost-effective?",
      options: ["Reserved Instances", "On-demand Instances", "Dedicated Instances", "Spot Instances"],
      correct: 3,
      explanation: "Spot instances offer the lowest cost and are perfect for fault-tolerant workloads that can handle interruptions."
    },
    {
      id: 3,
      question: "Which of the following AWS services will help achieve high transfer speeds for streaming video courses around the world?",
      options: ["Amazon SNS", "Amazon Kinesis Video Streams", "AWS CloudFormation", "Amazon CloudFront"],
      correct: 3,
      explanation: "CloudFront is a CDN that caches content at edge locations worldwide to reduce latency and improve transfer speeds."
    },
    {
      id: 4,
      question: "Select TWO examples of AWS shared controls.",
      options: ["Patch Management", "IAM Management", "VPC Management", "Configuration Management", "Data Center operations"],
      correct: [0, 3],
      multiSelect: true,
      explanation: "Patch Management and Configuration Management are shared responsibilities between AWS and customers."
    },
    {
      id: 5,
      question: "A company is planning to host an educational website on AWS. Their video courses will be streamed all around the world. Which AWS service will help achieve high transfer speeds?",
      options: ["Amazon SNS", "Amazon Kinesis Video Streams", "AWS CloudFormation", "Amazon CloudFront"],
      correct: 3,
      explanation: "Amazon CloudFront is a content delivery network that reduces latency by caching content at edge locations."
    },
    {
      id: 6,
      question: "Adjusting compute capacity dynamically to reduce cost is an implementation of which AWS cloud best practice?",
      options: ["Build security in every layer", "Parallelize tasks", "Implement elasticity", "Adopt monolithic architecture"],
      correct: 2,
      explanation: "Elasticity allows you to scale resources up or down based on demand, optimizing costs."
    },
    {
      id: 7,
      question: "What is the AWS feature that provides an additional level of security above the default authentication mechanism of usernames and passwords?",
      options: ["Encrypted keys", "Email verification", "AWS KMS", "AWS MFA"],
      correct: 3,
      explanation: "Multi-Factor Authentication (MFA) adds an extra layer of security beyond username and password."
    },
    {
      id: 8,
      question: "According to the AWS Acceptable Use Policy, which statement is true regarding penetration testing of EC2 instances?",
      options: [
        "Penetration testing is not allowed in AWS",
        "Penetration testing is performed automatically by AWS",
        "Penetration testing can be performed by the customer on their own instances without prior authorization",
        "AWS customers are only allowed to perform penetration testing on services managed by AWS"
      ],
      correct: 2,
      explanation: "AWS allows customers to perform penetration testing on their own instances without prior authorization for most services."
    },
    {
      id: 9,
      question: "Which principle is very important when designing AWS Cloud architecture: 'design for failure and nothing will fail'? Choose TWO.",
      options: ["Multi-factor authentication", "Availability Zones", "Elastic Load Balancing", "Penetration testing", "Vertical Scaling"],
      correct: [1, 2],
      multiSelect: true,
      explanation: "Availability Zones and Elastic Load Balancing help create fault-tolerant architectures."
    },
    {
      id: 10,
      question: "According to the AWS Shared Responsibility model, which are the customer's responsibilities? Choose TWO.",
      options: [
        "Managing environmental events of AWS data centers",
        "Protecting the confidentiality of data in transit in Amazon S3",
        "Controlling physical access to AWS Regions",
        "Ensuring that the underlying EC2 host is configured properly",
        "Patching applications installed on Amazon EC2"
      ],
      correct: [1, 4],
      multiSelect: true,
      explanation: "Customers are responsible for data protection and application-level security including patching."
    },
    {
      id: 11,
      question: "Which of the following are examples of AWS-Managed Services?",
      options: ["Amazon EC2", "Amazon S3", "AWS Lambda", "Amazon EMR", "Amazon EBS"],
      correct: [1, 2],
      multiSelect: true,
      explanation: "S3 and Lambda are fully managed services where AWS handles operational burdens."
    },
    {
      id: 12,
      question: "A company is planning to migrate an application from Amazon EC2 to AWS Lambda. Which will be AWS's responsibility after migration? Choose TWO.",
      options: ["Application management", "Capacity management", "Access control", "Operating system maintenance", "Data management"],
      correct: [1, 3],
      multiSelect: true,
      explanation: "With Lambda, AWS manages capacity and operating system maintenance automatically."
    },
    {
      id: 13,
      question: "What is the most cost-effective EC2 purchasing option for a workload with predictable usage patterns over 1-3 years?",
      options: ["On-demand instances", "Spot instances", "Reserved instances", "Dedicated instances"],
      correct: 2,
      explanation: "Reserved instances offer significant cost savings for predictable, long-term workloads."
    },
    {
      id: 14,
      question: "Which AWS service provides SSL/TLS certificates for HTTPS websites? Choose TWO.",
      options: ["Amazon Route 53", "AWS ACM", "AWS Directory Service", "AWS Identity & Access Management", "AWS Data Pipeline"],
      correct: [1],
      explanation: "AWS Certificate Manager (ACM) provides and manages SSL/TLS certificates."
    },
    {
      id: 15,
      question: "What are the connectivity options for building hybrid cloud architectures? Choose TWO.",
      options: ["AWS Artifact", "AWS Cloud9", "AWS Direct Connect", "AWS CloudTrail", "AWS VPN"],
      correct: [2, 4],
      multiSelect: true,
      explanation: "Direct Connect and VPN enable secure connections between on-premises and AWS."
    },
    {
      id: 16,
      question: "Which service distributes incoming HTTP traffic evenly across multiple EC2 instances?",
      options: ["AWS EC2 Auto Recovery", "AWS Auto Scaling", "AWS Network Load Balancer", "AWS Application Load Balancer"],
      correct: 3,
      explanation: "Application Load Balancer distributes HTTP/HTTPS traffic across multiple targets."
    },
    {
      id: 17,
      question: "Which is a MySQL-compatible relational database service that can scale capacity automatically?",
      options: ["Amazon Neptune", "Amazon Aurora", "Amazon RDS for SQL Server", "Amazon RDS for PostgreSQL"],
      correct: 1,
      explanation: "Amazon Aurora is MySQL and PostgreSQL compatible with automatic scaling capabilities."
    },
    {
      id: 18,
      question: "Which of the following are examples of the customer's responsibility for 'security IN the cloud'? Choose TWO.",
      options: ["Building a schema for an application", "Replacing physical hardware", "Creating a new hypervisor", "Patch management of underlying infrastructure", "File system encryption"],
      correct: [0, 4],
      multiSelect: true,
      explanation: "Customers handle application-level security including data encryption and application design."
    },
    {
      id: 19,
      question: "Which MFA device type can customers use to protect AWS resources?",
      options: ["AWS CloudHSM", "U2F Security Key", "AWS Access Keys", "AWS Key Pair"],
      correct: 1,
      explanation: "U2F Security Keys are hardware-based MFA devices supported by AWS."
    },
    {
      id: 20,
      question: "Which AWS service helps deploy a .NET application quickly?",
      options: ["Amazon SNS", "AWS Elastic Beanstalk", "AWS Systems Manager", "AWS Trusted Advisor"],
      correct: 1,
      explanation: "Elastic Beanstalk provides an easy platform for deploying applications including .NET."
    },
    {
      id: 21,
      question: "A company has business critical workloads and cannot accept downtime. What's the recommended disaster recovery strategy?",
      options: [
        "Replicate data across Edge Locations with CloudFront failover",
        "Deploy resources across Availability Zones in the same Region",
        "Create point-in-time backups in another subnet",
        "Deploy resources to another Region with Active-Active strategy"
      ],
      correct: 3,
      explanation: "Multi-region Active-Active deployment provides the highest availability for business-critical workloads."
    },
    {
      id: 22,
      question: "Which AWS services are used for change management and auditing? Choose TWO.",
      options: ["AWS CloudTrail", "Amazon Comprehend", "AWS Transit Gateway", "AWS X-Ray", "AWS Config"],
      correct: [0, 4],
      multiSelect: true,
      explanation: "CloudTrail logs API calls and Config tracks resource changes for auditing purposes."
    },
    {
      id: 23,
      question: "Which service runs containerized applications on EC2 instances?",
      options: ["AWS Fargate", "Amazon ECS", "AWS Lambda", "Amazon EKS"],
      correct: 1,
      explanation: "Amazon ECS (Elastic Container Service) runs Docker containers on EC2 instances."
    },
    {
      id: 24,
      question: "Which AWS feature helps ensure proper security settings? Choose TWO.",
      options: ["AWS Trusted Advisor", "Amazon Inspector", "Amazon SNS", "Amazon CloudWatch", "Concierge Support Team"],
      correct: [0, 1],
      multiSelect: true,
      explanation: "Trusted Advisor and Inspector both provide security recommendations and assessments."
    },
    {
      id: 25,
      question: "A global company wants to centrally manage billing and security across AWS accounts. Which service helps?",
      options: ["AWS Organizations", "AWS Trusted Advisor", "IAM User Groups", "AWS Config"],
      correct: 0,
      explanation: "AWS Organizations provides central management of multiple AWS accounts."
    }
  ];

  // Randomization function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get randomized questions for the exam
  const [questions, setQuestions] = useState([]);
  const [examMode, setExamMode] = useState('');

  const initializeExam = (mode) => {
    setExamMode(mode);
    let examQuestions;
    
    switch(mode) {
      case 'full':
        examQuestions = shuffleArray(allQuestions).slice(0, 25); // Using 25 for demo
        setTimeLeft(90 * 60); // 90 minutes
        break;
      case 'quick':
        examQuestions = shuffleArray(allQuestions).slice(0, 10);
        setTimeLeft(30 * 60); // 30 minutes
        break;
      case 'practice':
        examQuestions = shuffleArray(allQuestions).slice(0, 5);
        setTimeLeft(15 * 60); // 15 minutes
        break;
      default:
        examQuestions = shuffleArray(allQuestions).slice(0, 25);
        setTimeLeft(90 * 60);
    }
    
    setQuestions(examQuestions);
    setExamStarted(true);
  };

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft, showResults]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeSpent = () => {
    const totalTime = examMode === 'full' ? 90 * 60 : examMode === 'quick' ? 30 * 60 : 15 * 60;
    const spent = totalTime - timeLeft;
    return Math.max(0, spent);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const question = questions.find(q => q.id === questionId);
    if (question.multiSelect) {
      const currentAnswers = selectedAnswers[questionId] || [];
      const updatedAnswers = currentAnswers.includes(answerIndex)
        ? currentAnswers.filter(index => index !== answerIndex)
        : [...currentAnswers, answerIndex];
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: updatedAnswers
      }));
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (question.multiSelect) {
        if (Array.isArray(userAnswer) && Array.isArray(question.correct)) {
          if (userAnswer.length === question.correct.length &&
              userAnswer.every(ans => question.correct.includes(ans))) {
            correct++;
          }
        }
      } else {
        if (userAnswer === question.correct) {
          correct++;
        }
      }
    });
    return correct;
  };

  const getQuestionStatus = (index) => {
    const question = questions[index];
    const userAnswer = selectedAnswers[question.id];
    if (!userAnswer && userAnswer !== 0) return 'unanswered';
    
    if (question.multiSelect) {
      if (Array.isArray(userAnswer) && Array.isArray(question.correct)) {
        return userAnswer.length === question.correct.length &&
               userAnswer.every(ans => question.correct.includes(ans)) ? 'correct' : 'incorrect';
      }
    } else {
      return userAnswer === question.correct ? 'correct' : 'incorrect';
    }
    return 'incorrect';
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(90 * 60);
    setExamStarted(false);
    setQuestions([]);
    setExamMode('');
    setShowScores(false);
  };

  const startExam = (mode) => {
    setShowScores(false);
    initializeExam(mode);
  };

  const viewScores = () => {
    setShowScores(true);
    setExamStarted(false);
    setShowResults(false);
  };

  const submitExam = () => {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    const examResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode: examMode,
      score: score,
      total: questions.length,
      percentage: percentage,
      passed: passed,
      timeSpent: getTimeSpent()
    };
    
    setExamHistory(prev => [examResult, ...prev].slice(0, 20));
    setShowResults(true);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Show scores history
  if (showScores) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Exam Progress & History
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setShowScores(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Back to Exam
              </button>
            </div>
          </div>

          {examHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exam history yet</h3>
              <p className="text-gray-600 mb-4">Take your first practice exam to start tracking your progress!</p>
              <button
                onClick={() => setShowScores(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Take Practice Exam
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {examHistory.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Exams</div>
                </div>
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {examHistory.filter(exam => exam.passed).length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {examHistory.length > 0 ? Math.round(examHistory.reduce((sum, exam) => sum + exam.percentage, 0) / examHistory.length) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
                <div className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">
                    {examHistory.length > 0 ? Math.max(...examHistory.map(exam => exam.percentage)) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
              </div>

              {/* Exam History List */}
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Exam Results</h3>
                </div>
                <div className="divide-y">
                  {examHistory.map((exam, index) => (
                    <div key={exam.id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              exam.passed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {exam.passed ? '✓ PASSED' : '✗ FAILED'}
                            </span>
                            <span className="text-sm text-gray-600">
                              {exam.mode === 'full' ? 'Full Exam' : 
                               exam.mode === 'quick' ? 'Quick Practice' : 
                               'Mini Quiz'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(exam.date).toLocaleDateString()} at {new Date(exam.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-lg">
                              {exam.score}/{exam.total}
                            </div>
                            <div className="text-gray-600">Score</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold text-lg ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>
                              {exam.percentage}%
                            </div>
                            <div className="text-gray-600">Percentage</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-lg text-blue-600">
                              {formatDuration(exam.timeSpent)}
                            </div>
                            <div className="text-gray-600">Time</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!examStarted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <BookOpen className="mx-auto mb-4 text-blue-600" size={48} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              AWS Cloud Practitioner Practice Exam
            </h1>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setShowScores(false)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                  !showScores 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Take Exam
              </button>
              <button
                onClick={viewScores}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm md:text-base ${
                  showScores 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Progress ({examHistory.length})
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-4">Choose Your Exam Mode</h2>
              <div className="text-left space-y-4 text-blue-700">
                <p className="text-xs md:text-sm text-gray-600 mb-4 text-center">Questions are randomly selected from a pool of 25+ questions</p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-blue-300 rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-blue-800 mb-2 text-center">Full Exam</h3>
                    <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm mb-4">
                      <span className="bg-blue-100 px-2 py-1 rounded">25 questions</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">90 minutes</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">70% to pass</span>
                    </div>
                    <button
                      onClick={() => startExam('full')}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm md:text-base"
                    >
                      Start Full Exam
                    </button>
                  </div>

                  <div className="border border-green-300 rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-green-800 mb-2 text-center">Quick Practice</h3>
                    <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm mb-4">
                      <span className="bg-green-100 px-2 py-1 rounded">10 questions</span>
                      <span className="bg-green-100 px-2 py-1 rounded">30 minutes</span>
                      <span className="bg-green-100 px-2 py-1 rounded">Daily practice</span>
                    </div>
                    <button
                      onClick={() => startExam('quick')}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm md:text-base"
                    >
                      Quick Practice
                    </button>
                  </div>

                  <div className="border border-purple-300 rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-purple-800 mb-2 text-center">Mini Quiz</h3>
                    <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm mb-4">
                      <span className="bg-purple-100 px-2 py-1 rounded">5 questions</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">15 minutes</span>
                      <span className="bg-purple-100 px-2 py-1 rounded">Quick review</span>
                    </div>
                    <button
                      onClick={() => startExam('practice')}
                      className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm md:text-base"
                    >
                      Mini Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-gray-600">
              <p><strong>Note:</strong> Each exam uses different randomized questions - perfect for repeated practice!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Exam Results</h1>
            <div className="mb-2">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {examMode === 'full' ? 'Full Exam (25 questions)' : 
                 examMode === 'quick' ? 'Quick Practice (10 questions)' : 
                 'Mini Quiz (5 questions)'}
              </span>
            </div>
            <div className={`inline-flex items-center px-4 md:px-6 py-3 rounded-lg text-lg md:text-xl font-semibold ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {passed ? <CheckCircle className="mr-2" size={20} /> : <XCircle className="mr-2" size={20} />}
              {score} / {questions.length} ({percentage}%) - {passed ? 'PASSED' : 'FAILED'}
            </div>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {examMode === 'full' ? 'Passing score: 70% (18/25 questions)' : 
               examMode === 'quick' ? 'Passing score: 70% (7/10 questions)' :
               'Passing score: 70% (4/5 questions)'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Question Review</h2>
              <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const status = getQuestionStatus(index);
                  const userAnswer = selectedAnswers[question.id];
                  
                  return (
                    <div key={question.id} className={`border rounded-lg p-3 md:p-4 ${status === 'correct' ? 'border-green-300 bg-green-50' : status === 'incorrect' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                      <div className="flex items-start gap-2 md:gap-3">
                        <span className={`font-semibold text-sm md:text-base ${status === 'correct' ? 'text-green-700' : status === 'incorrect' ? 'text-red-700' : 'text-gray-700'}`}>
                          Q{index + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 mb-2 text-sm md:text-base leading-relaxed">{question.question}</p>
                          {question.multiSelect && (
                            <p className="text-xs md:text-sm text-blue-600 mb-2">Select multiple answers</p>
                          )}
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => {
                              const isUserAnswer = question.multiSelect 
                                ? Array.isArray(userAnswer) && userAnswer.includes(optIndex)
                                : userAnswer === optIndex;
                              const isCorrect = question.multiSelect
                                ? question.correct.includes(optIndex)
                                : question.correct === optIndex;
                              
                              return (
                                <div key={optIndex} className={`p-2 rounded text-xs md:text-sm leading-relaxed ${
                                  isCorrect 
                                    ? 'bg-green-200 text-green-800' 
                                    : isUserAnswer 
                                      ? 'bg-red-200 text-red-800' 
                                      : 'bg-white text-gray-700'
                                }`}>
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                  {isCorrect && ' ✓'}
                                  {isUserAnswer && !isCorrect && ' ✗'}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs md:text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Score Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Correct:</span>
                    <span className="text-green-600 font-semibold">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incorrect:</span>
                    <span className="text-red-600 font-semibold">{questions.length - score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-semibold">{questions.length}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span>Percentage:</span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetExam}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <RotateCcw size={18} />
                Retake Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const userAnswer = selectedAnswers[currentQ.id];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 md:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 p-3 md:p-4 bg-white border rounded-lg shadow-sm">
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            AWS Practice Exam
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock size={16} />
              <span className="font-mono text-sm md:text-lg">{formatTime(timeLeft)}</span>
            </div>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white border rounded-lg p-4 md:p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-xs md:text-sm text-gray-500">Question {currentQuestion + 1}</span>
                {currentQ.multiSelect && (
                  <span className="ml-2 text-xs md:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Select Multiple
                  </span>
                )}
              </div>
              
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6 leading-relaxed">
                {currentQ.question}
              </h2>

              <div className="space-y-2 md:space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = currentQ.multiSelect 
                    ? Array.isArray(userAnswer) && userAnswer.includes(index)
                    : userAnswer === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-3 md:p-4 border rounded-lg transition-colors ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-800' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <span className="font-semibold text-gray-600 text-sm md:text-base">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-sm md:text-base leading-relaxed">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 md:mt-8">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base ${
                    currentQuestion === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2 md:gap-3">
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={submitExam}
                      className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-green-700 text-sm md:text-base"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 text-sm md:text-base"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-white border rounded-lg p-3 md:p-4 h-fit shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 md:mb-4 text-sm md:text-base">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-1 md:gap-2">
              {questions.map((_, index) => {
                const questionAnswered = selectedAnswers[questions[index].id] !== undefined;
                
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm rounded font-semibold ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : questionAnswered
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                    } hover:opacity-80`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <span>Unanswered</span>
              </div>
            </div>

            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t">
              <div className="text-xs md:text-sm text-gray-600 space-y-1">
                <div>Answered: {Object.keys(selectedAnswers).length}</div>
                <div>Remaining: {questions.length - Object.keys(selectedAnswers).length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSPracticeExam;