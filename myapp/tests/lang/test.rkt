#!/usr/bin/racket
#lang racket


(require 2htdp/batch-io)
;(display "got here")


(define puzzle_name (vector-ref (current-command-line-arguments) 0))
(define username (vector-ref (current-command-line-arguments) 1))
(define userfile (string-append "tests/user/" username "/UserFun.rkt"))
;(display userfile)
(define userfun (dynamic-require userfile (string->symbol puzzle_name)))
;(display puzzle_name)

(define debug #f)

(define convert
	(lambda (str_arg typ)
		(cond 	[(equal? typ "int") (string->number str_arg)]
				[(equal? typ "float") (string->number str_arg)]
				[(equal? typ "char") (string-ref str_arg 0)]
				[(equal? typ "string") str_arg]
				[(equal? typ "bool") (equal? str_arg "true")]
				[(equal? typ "list-int") (map string->number (string-split str_arg ","))]
				[else -1])))

(define get-n-items
    (lambda (lst num)
        (if (> num 0)
            (cons (car lst) (get-n-items (cdr lst) (- num 1)))
            '()))) ;'

(define slice
    (lambda (lst start count)
        (if (> start 1)
            (slice (cdr lst) (- start 1) count)
            (get-n-items lst count))))


;(define fibonacci
;  (lambda (n)
;    (if (or (= n 0) (= n 1))
;    	n
;    	(+ (fibonacci (- n 1)) (fibonacci (- n 2))))))


;(define ns (variable-reference->namespace (#%variable-reference)))

;(define (string->procedure s)
;  (define sym (string->symbol s))
;  (eval sym ns))


(define are-equal?
	(lambda (typ)
		(cond [(equal? typ "int") =]
				[(equal? typ "float") =]
				[(equal? typ "string") equal?]
				[(equal? typ "bool") eq?]
				[(equal? typ "list-int") equal?]
				[else "unfinished"])))
(define main
	(lambda ()
		(let* (	;[f (read-lines (string-append puzzle_name ".txt"))]
				[f (read-lines (string-append "tests/puzzle/" puzzle_name ".txt"))]
				[test-count (string->number (car f))]
				[arg-count (string->number (cadr f))]
				[argt (slice f 3 arg-count)]
				[ret-type (vector-ref (list->vector f) (+ 2 arg-count))])
			;(display f)(newline)
			;(display argt)(newline)
			;(display ret-type)(newline)
			(let oloop ([cur-test 0]
						[passed 0]
						[cur-line (+ 5 arg-count)])
				;(display cur-test)(newline)
				;(display passed)(newline)
				;(display cur-line)(newline)
				(if (= cur-test test-count)
					(if (= passed test-count)
						(display "All tests passed!\n")
						(display (string-append "Number of tests passed: " (number->string passed) " out of " (number->string test-count) "\n")))
					(begin
						;(display "SLICE: ")
						;(display (slice f cur-line arg-count))(newline)
						(let ([res (apply userfun (map convert (slice f cur-line arg-count) argt))])
							(if ((are-equal? ret-type) res (convert (car (slice f (+ cur-line arg-count) 1)) ret-type))
								(oloop (+ 1 cur-test) (+ 1 passed) (+ cur-line (+ 2 arg-count)))
								(oloop (+ 1 cur-test) passed (+ cur-line (+ 2 arg-count)))))))))))


(main)
