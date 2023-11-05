#include <stdio.h>

void trans(int a[][3], int r, int c) {
    int t[c][r];
    //trans r->c
    for (int row = 0; row < r; row++) {
        for (int col = 0; col < c; col++) {
            t[col][row]=a[row][col];
        }
    }
    //print,n(r')->n(c)
    for (int row = 0; row < c; row++) {
        for (int col = 0; col < r; col++) {
            printf("%d ",t[row][col]);
        }
         printf("\n");
    }
}

int main() {
    int a[2][3] = {{1, 2, 3}, {4, 6, 9}};
    trans(a, 2, 3);
}
