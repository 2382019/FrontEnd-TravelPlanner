import { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../utils/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Budget', href: '/budget' },
    { name: 'Packing', href: '/packing' },
    { name: 'Itinerary', href: '/itinerary' },
    { name: 'Culinary', href: '/culinary' },
  ].map(item => ({
    ...item,
    current: location.pathname === item.href
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-[#C8A2C8] shadow-sm sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-200">
                      Travel Planner
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'border-gray-800 text-gray-900'
                            : 'border-transparent text-gray-700 hover:border-gray-600 hover:text-gray-800',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {isAuthenticated ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A2C8] focus:ring-offset-2 transition-shadow duration-200">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-[#f5f0f5] flex items-center justify-center hover:bg-[#e8dfe8] transition-colors duration-200">
                            <span className="text-[#C8A2C8] font-medium">
                              {user?.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-[#f5f0f5]' : '',
                                  'block w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors duration-200'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="space-x-4">
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="bg-white text-[#663366] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-[#b992b9] hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-[#b992b9] text-gray-900'
                        : 'text-gray-700 hover:bg-[#b992b9] hover:text-gray-900',
                      'block px-4 py-2 text-base font-medium transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              {isAuthenticated ? (
                <div className="border-t border-[#b992b9] pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[#f5f0f5] flex items-center justify-center">
                        <span className="text-[#C8A2C8] font-medium">
                          {user?.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">
                        {user?.username}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-[#b992b9] hover:text-gray-900 transition-colors duration-200"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-[#b992b9] pb-3 pt-4">
                  <div className="space-y-1">
                    <Disclosure.Button
                      as={Link}
                      to="/login"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-[#b992b9] hover:text-gray-900 transition-colors duration-200"
                    >
                      Sign in
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/register"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-[#b992b9] hover:text-gray-900 transition-colors duration-200"
                    >
                      Sign up
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
} 