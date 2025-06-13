package main

import (
	"Calculator/Function"
	"fmt"
)

func main () {
	num :=Function.Add(14 , 20)
	fmt.Println(num)

	num1 := Function.Sub(12 , 10)
	fmt.Println(num1)

	num2 := Function.Sub(12 , 10)
	fmt.Println(num2)

	num3 := Function.Sub(12 , 10)
	fmt.Println(num3)
}