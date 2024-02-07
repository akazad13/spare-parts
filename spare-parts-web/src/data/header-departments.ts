import { DepartmentsLink } from '../app/interfaces/departments-link';

export const departments: DepartmentsLink[] = [
    {
        title: 'Headlights & Lighting',
        url: '/shop',
        submenu: {
            type: 'megamenu',
            size: 'xl',
            image: 'assets/images/departments/departments-2.jpg',
            columns: [
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'Body Parts',
                            url: '/shop',
                            links: [
                                {title: 'Bumpers', url: '/shop'},
                                {title: 'Hoods', url: '/shop'},
                                {title: 'Grilles', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Door Handles', url: '/shop'},
                                {title: 'Car Covers', url: '/shop'},
                                {title: 'Tailgates', url: '/shop'},
                            ],
                        },
                        {title: 'Suspension', url: '/shop'},
                        {title: 'Steering', url: '/shop'},
                        {title: 'Fuel Systems', url: '/shop'},
                        {title: 'Transmission', url: '/shop'},
                        {title: 'Air Filters', url: '/shop'},
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'Headlights & Lighting',
                            url: '/shop',
                            links: [
                                {title: 'Headlights', url: '/shop'},
                                {title: 'Tail Lights', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Turn Signals', url: '/shop'},
                                {title: 'Switches & Relays', url: '/shop'},
                                {title: 'Corner Lights', url: '/shop'},
                            ],
                        },
                        {
                            title: 'Brakes & Suspension',
                            url: '/shop',
                            links: [
                                {title: 'Brake Discs', url: '/shop'},
                                {title: 'Wheel Hubs', url: '/shop'},
                                {title: 'Air Suspension', url: '/shop'},
                                {title: 'Ball Joints', url: '/shop'},
                                {title: 'Brake Pad Sets', url: '/shop'},
                            ],
                        },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'Interior Parts',
                            url: '/shop',
                            links: [
                                {title: 'Floor Mats', url: '/shop'},
                                {title: 'Gauges', url: '/shop'},
                                {title: 'Consoles & Organizers', url: '/shop'},
                                {title: 'Mobile Electronics', url: '/shop'},
                                {title: 'Steering Wheels', url: '/shop'},
                                {title: 'Cargo Accessories', url: '/shop'},
                            ],
                        },
                        {
                            title: 'Engine & Drivetrain',
                            url: '/shop',
                            links: [
                                {title: 'Air Filters', url: '/shop'},
                                {title: 'Oxygen Sensors', url: '/shop'},
                                {title: 'Heating', url: '/shop'},
                                {title: 'Exhaust', url: '/shop'},
                                {title: 'Cranks & Pistons', url: '/shop'},
                            ],
                        },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'Tools & Garage',
                            url: '/shop',
                            links: [
                                {title: 'Repair Manuals', url: '/shop'},
                                {title: 'Car Care', url: '/shop'},
                                {title: 'Code Readers', url: '/shop'},
                                {title: 'Tool Boxes', url: '/shop'},
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Interior Parts',
        url: '/shop',
        submenu: {
            type: 'megamenu',
            size: 'lg',
            image: 'assets/images/departments/departments-1.jpg',
            columns: [
                {
                    size: 3,
                    links: [
                        {
                            title: 'Body Parts',
                            url: '/shop',
                            links: [
                                {title: 'Bumpers', url: '/shop'},
                                {title: 'Hoods', url: '/shop'},
                                {title: 'Grilles', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Door Handles', url: '/shop'},
                                {title: 'Car Covers', url: '/shop'},
                                {title: 'Tailgates', url: '/shop'},
                            ],
                        },
                        {title: 'Suspension', url: '/shop'},
                        {title: 'Steering', url: '/shop'},
                        {title: 'Fuel Systems', url: '/shop'},
                        {title: 'Transmission', url: '/shop'},
                        {title: 'Air Filters', url: '/shop'},
                    ],
                },
                {
                    size: 3,
                    links: [
                        {
                            title: 'Headlights & Lighting',
                            url: '/shop',
                            links: [
                                {title: 'Headlights', url: '/shop'},
                                {title: 'Tail Lights', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Turn Signals', url: '/shop'},
                                {title: 'Switches & Relays', url: '/shop'},
                                {title: 'Corner Lights', url: '/shop'},
                            ],
                        },
                        {
                            title: 'Brakes & Suspension',
                            url: '/shop',
                            links: [
                                {title: 'Brake Discs', url: '/shop'},
                                {title: 'Wheel Hubs', url: '/shop'},
                                {title: 'Air Suspension', url: '/shop'},
                                {title: 'Ball Joints', url: '/shop'},
                                {title: 'Brake Pad Sets', url: '/shop'},
                            ],
                        },
                    ],
                },
                {
                    size: 3,
                    links: [
                        {
                            title: 'Interior Parts',
                            url: '/shop',
                            links: [
                                {title: 'Floor Mats', url: '/shop'},
                                {title: 'Gauges', url: '/shop'},
                                {title: 'Consoles & Organizers', url: '/shop'},
                                {title: 'Mobile Electronics', url: '/shop'},
                                {title: 'Steering Wheels', url: '/shop'},
                                {title: 'Cargo Accessories', url: '/shop'},
                            ],
                        },
                    ],
                },
                {
                    size: 3,
                    links: [
                        {
                            title: 'Tools & Garage',
                            url: '/shop',
                            links: [
                                {title: 'Repair Manuals', url: '/shop'},
                                {title: 'Car Care', url: '/shop'},
                                {title: 'Code Readers', url: '/shop'},
                                {title: 'Tool Boxes', url: '/shop'},
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Switches & Relays',
        url: '/shop',
        submenu: {
            type: 'megamenu',
            size: 'md',
            image: 'assets/images/departments/departments-3.jpg',
            columns: [
                {
                    size: 4,
                    links: [
                        {
                            title: 'Body Parts',
                            url: '/shop',
                            links: [
                                {title: 'Bumpers', url: '/shop'},
                                {title: 'Hoods', url: '/shop'},
                                {title: 'Grilles', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Door Handles', url: '/shop'},
                                {title: 'Car Covers', url: '/shop'},
                                {title: 'Tailgates', url: '/shop'},
                            ],
                        },
                        {title: 'Suspension', url: '/shop'},
                        {title: 'Steering', url: '/shop'},
                        {title: 'Fuel Systems', url: '/shop'},
                        {title: 'Transmission', url: '/shop'},
                        {title: 'Air Filters', url: '/shop'},
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'Headlights & Lighting',
                            url: '/shop',
                            links: [
                                {title: 'Headlights', url: '/shop'},
                                {title: 'Tail Lights', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Turn Signals', url: '/shop'},
                                {title: 'Switches & Relays', url: '/shop'},
                                {title: 'Corner Lights', url: '/shop'},
                            ],
                        },
                        {
                            title: 'Brakes & Suspension',
                            url: '/shop',
                            links: [
                                {title: 'Brake Discs', url: '/shop'},
                                {title: 'Wheel Hubs', url: '/shop'},
                                {title: 'Air Suspension', url: '/shop'},
                                {title: 'Ball Joints', url: '/shop'},
                                {title: 'Brake Pad Sets', url: '/shop'},
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'Interior Parts',
                            url: '/shop',
                            links: [
                                {title: 'Floor Mats', url: '/shop'},
                                {title: 'Gauges', url: '/shop'},
                                {title: 'Consoles & Organizers', url: '/shop'},
                                {title: 'Mobile Electronics', url: '/shop'},
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Tires & Wheels',
        url: '/shop',
        submenu: {
            type: 'megamenu',
            size: 'nl',
            image: 'assets/images/departments/departments-4.jpg',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Body Parts',
                            url: '/shop',
                            links: [
                                {title: 'Bumpers', url: '/shop'},
                                {title: 'Hoods', url: '/shop'},
                                {title: 'Grilles', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Door Handles', url: '/shop'},
                                {title: 'Car Covers', url: '/shop'},
                                {title: 'Tailgates', url: '/shop'},
                            ],
                        },
                        {title: 'Suspension', url: '/shop'},
                        {title: 'Steering', url: '/shop'},
                        {title: 'Fuel Systems', url: '/shop'},
                        {title: 'Transmission', url: '/shop'},
                        {title: 'Air Filters', url: '/shop'},
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'Headlights & Lighting',
                            url: '/shop',
                            links: [
                                {title: 'Headlights', url: '/shop'},
                                {title: 'Tail Lights', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Turn Signals', url: '/shop'},
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Tools & Garage',
        url: '/shop',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 12,
                    links: [
                        {
                            title: 'Body Parts',
                            url: '/shop',
                            links: [
                                {title: 'Bumpers', url: '/shop'},
                                {title: 'Hoods', url: '/shop'},
                                {title: 'Grilles', url: '/shop'},
                                {title: 'Fog Lights', url: '/shop'},
                                {title: 'Door Handles', url: '/shop'},
                                {title: 'Car Covers', url: '/shop'},
                                {title: 'Tailgates', url: '/shop'},
                            ],
                        },
                        {title: 'Suspension', url: '/shop'},
                        {title: 'Steering', url: '/shop'},
                        {title: 'Fuel Systems', url: '/shop'},
                        {title: 'Transmission', url: '/shop'},
                        {title: 'Air Filters', url: '/shop'},
                    ],
                },
            ],
        },
    },
    {title: 'Clutches', url: '/shop'},
    {title: 'Fuel Systems', url: '/shop'},
    {title: 'Steering', url: '/shop'},
    {title: 'Suspension', url: '/shop'},
    {title: 'Body Parts', url: '/shop'},
    {title: 'Transmission', url: '/shop'},
    {title: 'Air Filters', url: '/shop'},
];
