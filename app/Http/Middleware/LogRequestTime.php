<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogRequestTime
{
    public function handle(Request $request, Closure $next) {

        $start = microtime(true);
        $response = $next($request);

        $time = round((microtime(true) - $start) * 1000, 2);

        Log::info('request', [
            'method'=>$request->method(),
            'path'=>$request->path(),
            'time_ms'=>$time,
            'status'=>$response->status()
        ]);
        // optionally
        $response->headers->set('X-Response-Time-ms', $time);
        return $response;
    }
}
