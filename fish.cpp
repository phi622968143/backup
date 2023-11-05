#include <iostream>
#include <cmath>
#include <thread>
#include <chrono> 

void clearConsole() {
    std::system("clear");
}

int main() {
    float n, i, j, t, s;
    std::cout << "Enter the size of fish: ";
    std::cin >> n;

    // Calculate initial parameters
    n = n + 14;
    s = n / 10;
    t = 4.72 / n;

    int swimDistance = 40;  // How far the fish swims

    while (swimDistance > 0) {
        // Clear the console
        clearConsole();

        // Print the fish
        for (j = floor(s); j >= -ceil(s); j--) {
            // Print spaces to simulate fish moving forward
            for (int k = 0; k < swimDistance; ++k) {
                std::cout << " ";
            }

            for (i = 0; i <= 4; i = i + t) {
                if ((j < s / 2 && j > s / 4 && i < 1 && i > 0.8) || (j == 0 && i < 0.6) || (pow(j / s, 2) >= pow(sin(i), 2))) {
                    std::cout << " ";
                } else {
                    std::cout << "*";
                }
            }
            std::cout << std::endl;
        }

        // Reduce swim distance to move the fish forward
        swimDistance--;

        // Add a delay to control the speed of movement
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    return 0;
}
