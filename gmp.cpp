#include<iostream>
#include<gmp.h>

using namespace std;

int main (int argc, char **argv) {

    mpz_t a,b,c;
    mpz_inits(a,b,c,NULL);

    mpz_set_str(a, "90807897686", 10);
    mpz_set_str(b,"56787867867867", 10); //Decimal base

    mpz_addmul(c,a,b);

    cout<<"\nThe result of ";
    mpz_out_str(stdout, 10, a);
    cout<<" * ";
    mpz_out_str(stdout, 10, b);
    cout<<"\n";
    mpz_out_str(stdout, 10, c); //Stream, numerical base, var
    cout<<endl;

    return 0;
}