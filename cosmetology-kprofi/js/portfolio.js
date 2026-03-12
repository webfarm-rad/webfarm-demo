/**
 * Portfolio Filtering and Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioFilter();
    addPortfolioStyles();
});

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length === 0 || portfolioItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function addPortfolioStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .portfolio {
            padding: 80px 0;
            background-color: #fff;
        }

        .portfolio-filters {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 48px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 12px 24px;
            font-family: 'Montserrat', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            color: #6C757D;
            background-color: #F8F9FA;
            border: 2px solid transparent;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .filter-btn:hover {
            color: #E8B4B8;
            background-color: #F4D4D7;
        }

        .filter-btn.active {
            color: #fff;
            background: linear-gradient(135deg, #E8B4B8 0%, #D89BA0 100%);
            border-color: #E8B4B8;
        }

        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 32px;
        }

        .portfolio-item {
            opacity: 1;
            transform: scale(1);
            transition: all 0.3s ease;
        }

        .portfolio-image {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }

        .portfolio-image:hover {
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .portfolio-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .portfolio-image:hover img {
            transform: scale(1.1);
        }

        .portfolio-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 32px;
            background: linear-gradient(180deg, transparent 0%, rgba(61, 48, 82, 0.95) 100%);
            color: #fff;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .portfolio-image:hover .portfolio-overlay {
            opacity: 1;
        }

        .portfolio-title {
            font-size: 1.25rem;
            color: #fff;
            margin-bottom: 8px;
        }

        .portfolio-description {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
            .portfolio-grid {
                grid-template-columns: 1fr;
            }

            .portfolio-filters {
                gap: 8px;
            }

            .filter-btn {
                padding: 10px 20px;
                font-size: 0.875rem;
            }
        }
    `;
    document.head.appendChild(style);
}