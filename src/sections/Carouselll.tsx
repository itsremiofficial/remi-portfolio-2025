import React, { useEffect, useRef } from 'react';
 

interface MetricCard {
  id: string;
  metric: string;
  value: string;
  category: string;
  company: string;
  progress: number;
  backgroundImage: string;
  rotationY: number;
}

const Carousel3D: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(-72.1318);
  const animationFrameRef = useRef<number>(0);

  const cards: MetricCard[] = [
    {
      id: 'i1',
      metric: 'CPA Decreased',
      value: '+50%',
      category: 'SAAS',
      company: 'HousePark',
      progress: 50,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8f20139dcc22605a99ca_Instagram%20story%20-%2039.jpg',
      rotationY: 180
    },
    {
      id: 'i2',
      metric: 'ROAS Boosted',
      value: '+23%',
      category: 'Ecommerce',
      company: 'HaskaPowers',
      progress: 23,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8f08d1ea6cf7e73e89cb_Instagram%20story%20-%2038.jpg',
      rotationY: 210
    },
    {
      id: 'i3',
      metric: 'Increased Retention',
      value: '+13%',
      category: 'SaaS UX',
      company: 'Gameface',
      progress: 13,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8ed3e97cd06999245d1d_Instagram%20story%20-%2031.jpg',
      rotationY: 240
    },
    {
      id: 'i4',
      metric: 'AOV increased',
      value: '55%',
      category: 'Supplement Ecommerce',
      company: 'Nexflo',
      progress: 55,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8eb06e2664069bdea779_Instagram%20story%20-%2036.jpg',
      rotationY: 270
    },
    {
      id: 'i5',
      metric: 'CVR increased',
      value: '200%',
      category: 'Product Design',
      company: 'First Class Lacrosse',
      progress: 100,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8e8ae97cd06227245864_Instagram%20story%20-%2037.jpg',
      rotationY: 300
    },
    {
      id: 'i6',
      metric: 'CPA decreased',
      value: '+29%',
      category: 'Marketing Funnel',
      company: 'ColdJunctions',
      progress: 29,
      backgroundImage: 'https://cdn.prod.website-files.com/6290bdb841b2b5659918418c/645b8e2b139dcc02635a8b12_Instagram%20story%20-%2027.jpg',
      rotationY: 330
    }
  ];

  useEffect(() => {
    const animate = () => {
      rotationRef.current -= 0.2; // Adjust speed as needed
      
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translate3d(0px, 0px, 1500px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${rotationRef.current}deg) rotateZ(0deg) skew(0deg, 0deg)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="metrics-carousel">
      <div className="carousel-container">
        <div 
          ref={carouselRef}
          className="carousel-wrapper"
          style={{
            transform: `translate3d(0px, 0px, 1500px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${rotationRef.current}deg) rotateZ(0deg) skew(0deg, 0deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`metric-card ${card.id}`}
              style={{
                backgroundImage: `url("${card.backgroundImage}"), linear-gradient(#521e7fe0 34%, #521e7f1f)`,
                transform: `rotateX(0deg) rotateY(${card.rotationY}deg) rotateZ(0deg) translate3d(0, 0, 800px)`
              }}
            >
              <div className="card-content">
                <div>
                  <div className="metric-label">{card.metric}</div>
                  <div className="metric-value">{card.value}</div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <div>
                  <div className="category-label">{card.category}</div>
                  <div className="company-name">{card.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel3D;