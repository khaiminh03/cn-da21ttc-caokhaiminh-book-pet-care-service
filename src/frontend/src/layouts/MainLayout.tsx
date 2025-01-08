import React, { ReactNode} from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="flex-h">
      <section id="content">
        <Header />
        <main>
          {children}
        </main>
      </section>
    </div>
  );
};

export default MainLayout;