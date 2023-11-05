#include <stdio.h>
struct Node
{
    int data;
    Node* link;
};

Node* c_n(int d,Node* p){//n new;p pre
    Node* n=new Node();
    p->link=n;//link
    
    n->data=d;
    n->link=NULL;
    return n;
}

void traversal(Node* H){
    while(H->link!=NULL){
        H=H->link;//move 
        printf("%d ",H->data);//print data
    }
}

int main(){
    Node* head1=new Node();//**alloc memory
    head1->link=NULL;
    Node* prevNode = head1; // Initialize with head1

    for (int i = 0; i < 15; ++i) {
        prevNode = c_n(i, prevNode); 
        // creat++,return it address
       //(next time become old)
    }
    traversal(head1);
    
    delete head1;
}