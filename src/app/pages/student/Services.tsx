import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Briefcase, CheckCircle, Info } from 'lucide-react';
import { students, services } from '../../data/mockData';

export default function StudentServices() {
  const currentStudent = students[0]; // Emma Wilson
  const myServices = services.filter(s => 
    s.assignedStudents.includes(currentStudent.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">My Service Duties</h2>
        <p className="text-sm text-gray-500">Your assigned service roles and responsibilities</p>
      </div>

      {/* Current Service Role */}
      {currentStudent.serviceRole && (
        <Card className="p-6 border-2 border-purple-500 bg-purple-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{currentStudent.serviceRole}</h3>
                <Badge className="bg-purple-600 hover:bg-purple-600">Active</Badge>
              </div>
              <p className="text-gray-700">
                {services.find(s => s.name === currentStudent.serviceRole)?.description || 
                 'Service duties assigned to you'}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
        </Card>
      )}

      {/* All Assigned Services */}
      {myServices.length > 0 ? (
        <div className="grid gap-4">
          {myServices.map(service => (
            <Card key={service.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {service.assignedStudents.length} {service.assignedStudents.length === 1 ? 'student' : 'students'} assigned
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">You don't have any service duties assigned yet</p>
        </Card>
      )}

      {/* Service Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Service Duty Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Complete your assigned duties on time and with care</li>
              <li>• Report any issues or concerns to your teacher</li>
              <li>• Maintain high standards in your service area</li>
              <li>• Cooperate with other students in shared service duties</li>
              <li>• Service roles may be rotated periodically</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* All Available Services (Info) */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All Available Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.map(service => (
            <div 
              key={service.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                myServices.some(s => s.id === service.id)
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="font-medium text-gray-900 text-sm mb-1">{service.name}</p>
              <p className="text-xs text-gray-600">{service.assignedStudents.length} students</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
