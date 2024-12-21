INSERT INTO tickets (
    customer_id, title, description, completed, tech, created_at, updated_at
) VALUES (1, 'Laptop not powering on', 'Customer reported that their laptop does not power on even when plugged in.', false, 'unassigned', now(), now()),
    (1, 'Slow computer performance', 'Customer mentioned that their computer is running very slowly.', false, 'unassigned', now(), now()),
    (1, 'Virus removal', 'Customer needs virus removal service for their desktop computer.', false, 'unassigned', now(), now()),
    (2, 'Screen replacement', 'Customer needs to replace a cracked screen on their laptop.', false, 'unassigned', now(), now()),
    (2, 'Data recovery', 'Customer accidentally deleted important files and needs data recovery.', false, 'unassigned', now(), now()),
    (2, 'Software installation', 'Customer requested installation of new software.', false, 'unassigned', now(), now()),
    (3, 'Wi-Fi connectivity issues', 'Customer is experiencing problems connecting to Wi-Fi.', false, 'unassigned', now(), now()),
    (3, 'Keyboard not working', 'Customer reported that the keyboard on their laptop is not functioning.', false, 'unassigned', now(), now()),
    (3, 'Overheating problem', 'Customer''s computer is overheating and shutting down frequently.', false, 'unassigned', now(), now()),
    (4, 'Hard drive replacement', 'Customer needs to replace a failing hard drive.', false, 'unassigned', now(), now()),
    (4, 'Operating system upgrade', 'Customer requested an upgrade to the latest operating system.', false, 'unassigned', now(), now()),
    (4, 'Battery replacement', 'Customer needs a replacement for their laptop battery.', false, 'unassigned', now(), now()),
    (5, 'Printer setup', 'Customer needs help setting up a new printer.', false, 'unassigned', now(), now()),
    (5, 'Blue screen error', 'Customer''s computer is showing a blue screen error frequently.', false, 'unassigned', now(), now()),
    (5, 'Memory upgrade', 'Customer requested an upgrade to their computer’s RAM.', false, 'unassigned', now(), now());