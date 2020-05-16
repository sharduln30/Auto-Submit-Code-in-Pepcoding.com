import java.io.*;
import java.util.*;

public class Main{

public static void main(String[] args) throws Exception {
    // write your code here
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    
    for(int i=0;i<n;i++){
        a[i] = sc.nextInt();
    }
    int size = (int)Math.pow(2,n);
    for(int i=0;i<size;i++){
        
        String var ="";
        int iHelper = i;
        
        for(int j=0;j<n;j++){
            
            int rem = iHelper%2;
            iHelper/=2;
            
            if(rem==1){
                var = a[n-j-1]+"\t"+var;
                
            }
            else{
                var="-\t"+var;
            }
           
        }
         System.out.println(var);
    }
   
 }

}