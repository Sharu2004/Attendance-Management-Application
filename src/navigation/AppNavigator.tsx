import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { LoadingView } from '../components/LoadingView';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { SeniorDashboardScreen } from '../screens/senior/SeniorDashboardScreen';
import { StaffDashboardScreen } from '../screens/staff/StaffDashboardScreen';
import { TeamAttendanceScreen } from '../screens/attendance/TeamAttendanceScreen';
import { PersonalHistoryScreen } from '../screens/attendance/PersonalHistoryScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { currentUser, isLoading } = useApp();

  if (isLoading) {
    return <LoadingView message="Initializing attendance system..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {currentUser === null ? (
          // Unauthenticated Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : currentUser.role === 'admin' ? (
          // Admin Protected Stack
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
            <Stack.Screen name="UserManagement" component={UserManagementScreen} />
            <Stack.Screen name="PersonalHistory" component={PersonalHistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : currentUser.role === 'senior_staff' ? (
          // Senior Staff Protected Stack
          <>
            <Stack.Screen name="SeniorDashboard" component={SeniorDashboardScreen} />
            <Stack.Screen name="TeamAttendance" component={TeamAttendanceScreen} />
            <Stack.Screen name="PersonalHistory" component={PersonalHistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          // Staff Protected Stack
          <>
            <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} />
            <Stack.Screen name="PersonalHistory" component={PersonalHistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
